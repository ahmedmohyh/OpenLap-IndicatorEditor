package com.openlap.AnalyticsEngine.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsEngine.Exceptions.BadRequestException;
import com.openlap.AnalyticsEngine.Exceptions.ItemNotFoundException;
import com.openlap.AnalyticsEngine.dto.AuthUser;
import com.openlap.AnalyticsEngine.dto.LoginUser;
import com.openlap.AnalyticsEngine.dto.QueryParameters;
import com.openlap.AnalyticsEngine.dto.Request.BasicIndicatorPreview;
import com.openlap.AnalyticsEngine.dto.Request.IndicatorPreviewRequest;
import com.openlap.AnalyticsEngine.dto.Request.IndicatorSaveRequest;
import com.openlap.AnalyticsEngine.dto.Request.QuestionSaveRequest;
import com.openlap.AnalyticsEngine.dto.Response.*;
import com.openlap.AnalyticsEngine.dto.WrapperRequest;
import com.openlap.AnalyticsEngine.model.Indicator;
import com.openlap.AnalyticsEngine.model.OpenLapUser;
import com.openlap.AnalyticsEngine.model.Question;
import com.openlap.AnalyticsEngine.model.TriadCache;
import com.openlap.AnalyticsEngine.security.config.TokenContextHolder;
import com.openlap.AnalyticsEngine.security.config.TokenProvider;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import com.openlap.AnalyticsMethods.services.AnalyticsMethodsClassPathLoader;
import com.openlap.AnalyticsMethods.services.AnalyticsMethodsService;
import com.openlap.AnalyticsModules.model.*;
import com.openlap.Common.Utils;
import com.openlap.OpenLAPAnalyticsFramework;
import com.openlap.Visualizer.dtos.request.GenerateVisualizationCodeRequest;
import com.openlap.Visualizer.dtos.request.ValidateVisualizationTypeConfigurationRequest;
import com.openlap.Visualizer.dtos.response.GenerateVisualizationCodeResponse;
import com.openlap.Visualizer.dtos.response.ValidateVisualizationTypeConfigurationResponse;
import com.openlap.Visualizer.dtos.response.VisualizationTypeConfigurationResponse;
import com.openlap.Visualizer.model.VisualizationLibrary;
import com.openlap.Visualizer.model.VisualizationType;
import com.openlap.dataset.*;
import com.openlap.dynamicparam.OpenLAPDynamicParam;
import com.openlap.exceptions.AnalyticsMethodInitializationException;
import com.openlap.exceptions.OpenLAPDataColumnException;
import com.openlap.template.AnalyticsMethod;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;
import protostream.com.google.gson.Gson;

import javax.persistence.*;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.TransactionManager;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AnalyticsEngineService {

    private static final Logger log = LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);
    private static final Logger logger = LoggerFactory.getLogger(OpenLapUser.class);

    @Value("${learninglocker.org_id}")
    String orgId;
    @Value("${learninglocker.lrs_id}")
    String lrsId;

    Function<String, ObjectId> getId = ObjectId::new;

    //	private final ObjectId organizationId = new ObjectId("61d2972063385727785a9abe");
//	private final ObjectId lrsId = new ObjectId("61d2988aa80383455cddaa14");
    @Autowired
    public StatementServiceImp statementServiceImp;
    @Autowired
    public ActivityServiceImp activityServiceImp;
    Gson gson = new Gson();
    @Value("${visualizerURL}")
    String visualizerURL;
    WrapperRequest wrapperRequest;
    TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
    EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
    EntityManager em = factory.createEntityManager();

    @Value("${indicatorExecutionURL}")
    private String indicatorExecutionURL;
    @Value("${questionExecutionURL}")
    private String questionExecutionURL;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserService userService;
    @Autowired
    private TokenProvider jwtTokenUtil;
    private long executionCount = 0;
    private long previewCount = 0;
    @Autowired
    private AnalyticsMethodsService analyticsMethodsService;

    @Autowired
    MongoTemplate mongoTemplate;

    public String generateIndicatorIViewTemplate(String triadID, String baseUrl, Model model, boolean previewMode) {
        ObjectMapper mapper = new ObjectMapper();
        Triad triad = null;
        try {
            String triadJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/" + triadID);
            triad = mapper.readValue(triadJSON, Triad.class);
        } catch (Exception exc) {
            exc.printStackTrace();
//            throw new ItemNotFoundException("Indicator with triad id '" + triadID + "' not found.", "1");
        }

        if (triad == null)
            throw new ItemNotFoundException("Indicator with triad id '" + triadID + "' not found.", "1");

        Indicator indicator = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());

        String indicatorName = indicator.getName();

        // 【TODO】PreviewMode
        String vizCode = generateVisualizationCodeByTriadId(triadID, baseUrl, previewMode);
        if (vizCode == null) {
            String response = "<h2>No Visualization available</h2>";
            model.addAttribute("indicatorCode", response);
        } else {
            model.addAttribute("indicatorCode", vizCode);
            model.addAttribute("indicatorName", indicatorName);
        }

        return "indicator";
    }

    public String generateQuestionIViewTemplate(String questionId, String baseUrl, Model model) {
        StringBuilder stringBuilder = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();

        model.addAttribute("questionName", getQuestionById(questionId).getName());

        List<Triad> triadByQuestionId = getTriadByQuestionId(questionId);

        if (triadByQuestionId.size() > 0) {
            int count = 1;
            for (Triad triad : triadByQuestionId) {
                try {
                    String triadJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/" + triad.getId());
                    triad = mapper.readValue(triadJSON, Triad.class);
                } catch (Exception exc) {
                    throw new ItemNotFoundException("Indicator with triad id '" + triad.getId() + "' not found.", "1");
                }
                if (triad == null)
                    throw new ItemNotFoundException("Indicator not found.", "1");
                Indicator indicator = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());
                String indicatorName = indicator.getName();

                if (count % 2 == 1)
                    stringBuilder.append("<div class=\"row justify-content-sm-center padTopBottom\">");

                stringBuilder.append(
                        "<div class=\"col col-lg-6\" align=\"center\">\n" +
                                "\t\t\t\t<div class=\"row justify-content-sm-center padTopBottom\">\n" +
                                "\t\t\t\t\t<div class=\"col col-lg-6\" align=\"center\">\n" +
                                "\t\t\t\t\t\t<h6>" + indicatorName + "</h6>\n" +
                                "\t\t\t\t\t</div>\n" +
                                "\t\t\t\t</div>\n" +
                                "\t\t\t\t<div class=\"row padTopBottom\" align=\"center\">");
                try {
                    stringBuilder.append(generateVisualizationCodeByTriadId(triad.getId(), baseUrl, false));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                stringBuilder.append("\t\t\t\t</div>\n" +
                        "\t\t\t</div>");
                if (triadByQuestionId.size() == 1 || count % 2 == 0) {
                    stringBuilder.append("</div>");
                }
                if (triadByQuestionId.size() == count) {
                    stringBuilder.append("</div>");
                }
                count++;
            }
            model.addAttribute("questionCode", stringBuilder);
        } else {
            stringBuilder.append("No indicators associated with the question.");
        }
        return "question";
    }

    public String generateVisualizationCodeByTriadId(String triadID, String baseUrl, boolean previewMode) {
        Triad triadById = getTriadById(triadID);

        // 【TODO】待优化 加缓存
        if (triadById != null) {
            TriadCache cacheByTriadId = null;
            if (!previewMode) {
                cacheByTriadId = fetchTriadCacheById(triadID);
            }

            if (cacheByTriadId == null) {
                ObjectMapper mapper = new ObjectMapper();
                Triad triad;
                try {
                    String triadJSON = Utils
                            .performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/" + triadID);
                    triad = mapper.readValue(triadJSON, Triad.class);
                } catch (Exception exc) {
                    throw new ItemNotFoundException("Indicator with id '" + triadID + "' not found.", "1");
                }
                OpenLAPDataSet analyzedDataSet = null;
                if (triad.getIndicatorReference().getIndicatorType().equals("Basic Indicator")) {
                    Indicator curInd = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());
                    if (curInd == null) {
                        throw new ItemNotFoundException("Indicator with id '"
                                + triad.getIndicatorReference().getIndicators().get("0").getId() + "' not found.", "1");
                    }
                    QueryParameters curIndQuery = mapper.convertValue(curInd.getQueries().get("0"),
                            QueryParameters.class);
                    OpenLAPDataSet queryDataSet = null;
                    try {
                        queryDataSet = statementServiceImp.getAllStatementsByCustomQuery(getId.apply(orgId), getId.apply(lrsId),
                                curIndQuery);
                    } catch (Exception exc) {
                        throw new ItemNotFoundException("No data found for the indicator with id '"
                                + triad.getIndicatorReference().getIndicators().get("0").getId() + "'.", "1");
                    }
                    // Applying the analytics method
                    try {
                        AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader = analyticsMethodsService
                                .getFolderNameFromResources();
                        AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(
                                triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId(),
                                analyticsMethodsClassPathLoader);
                        Map<String, String> methodParams = triad.getAnalyticsMethodReference().getAnalyticsMethods()
                                .get("0").getAdditionalParams();

                        method.initialize(queryDataSet,
                                triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0"), methodParams);
                        analyzedDataSet = method.execute();
                    } catch (AnalyticsMethodInitializationException | Exception amexc) {
                        throw new ItemNotFoundException(amexc.getMessage(), "1");
                    }
                }

                // Visualizing the analyzed data
                String indicatorCode = "";
                try {
                    Map<String, Object> additionalParams = new HashMap<String, Object>();
                    ArrayList<String> list = new ArrayList<String>() {
                        {
                            add("width");
                            add("height");
                        }
                    };
                    for (String entry : list) {
                        if (previewMode) {
                            additionalParams.put(entry, "260");
                        } else {
                            additionalParams.put(entry, "500");
                        }
                    }
                    GenerateVisualizationCodeRequest visualRequest = new GenerateVisualizationCodeRequest();
                    visualRequest.setLibraryId(triad.getVisualizationReference().getLibraryId());
                    visualRequest.setTypeId(triad.getVisualizationReference().getTypeId());
                    visualRequest.setDataSet(analyzedDataSet);
                    visualRequest.setPortConfiguration(triad.getAnalyticsMethodToVisualizationMapping());
                    visualRequest.setParams(additionalParams);

                    String visualRequestJSON = mapper.writeValueAsString(visualRequest);
                    GenerateVisualizationCodeResponse visualResponse = Utils.performJSONPostRequest(
                            baseUrl + "/generateVisualizationCode", visualRequestJSON,
                            GenerateVisualizationCodeResponse.class);
                    indicatorCode = visualResponse.getVisualizationCode();
                } catch (Exception exc) {
                    throw new ItemNotFoundException(exc.getMessage(), "1");
                }
                String encodedCode = Utils.encodeURIComponent(indicatorCode);
                if (!previewMode) {
                    saveTriadCache(triadID, encodedCode);
                }

                return indicatorCode;

            } else {
                String encodedCode = cacheByTriadId.getCode();

                return Utils.decodeURIComponent(encodedCode);
            }
        } else {
            return null;
        }
    }


    public OpenLAPDataSet getOutputDataSourceByTriad(Triad triad, String baseUrl) {
        ObjectMapper mapper = new ObjectMapper();
        OpenLAPDataSet analyzedDataSet = null;
        if (triad.getIndicatorReference().getIndicatorType().equals("Basic Indicator")) {
            Indicator curInd = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());
            if (curInd == null) {
                throw new ItemNotFoundException("Indicator with id '"
                        + triad.getIndicatorReference().getIndicators().get("0").getId() + "' not found.", "1");
            }
            QueryParameters curIndQuery = mapper.convertValue(curInd.getQueries().get("0"),
                    QueryParameters.class);
            OpenLAPDataSet queryDataSet = null;
            try {
                queryDataSet = statementServiceImp.getAllStatementsByCustomQuery(getId.apply(orgId), getId.apply(lrsId),
                        curIndQuery);
            } catch (Exception exc) {
                throw new ItemNotFoundException("No data found for the indicator with id '"
                        + triad.getIndicatorReference().getIndicators().get("0").getId() + "'.", "1");
            }
            // Applying the analytics method
            try {
                AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader = analyticsMethodsService
                        .getFolderNameFromResources();
                AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(
                        triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId(),
                        analyticsMethodsClassPathLoader);
                Map<String, String> methodParams = triad.getAnalyticsMethodReference().getAnalyticsMethods()
                        .get("0").getAdditionalParams();

                method.initialize(queryDataSet,
                        triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0"), methodParams);
                analyzedDataSet = method.execute();
            } catch (AnalyticsMethodInitializationException | Exception amexc) {
                throw new ItemNotFoundException(amexc.getMessage(), "1");
            }
        }
        return analyzedDataSet;

    }


    public String executeIndicatorHQL(Map<String, String> params, String baseUrl) throws OpenLAPDataColumnException, JSONException, JsonProcessingException {
        boolean performCache = true;
        boolean isPersonalIndicator = false;
        long indicatorExecutionStartTime = System.currentTimeMillis();
        String userHashId = params.containsKey("rid") ? params.get("rid") : null;

        long localExecutionCount = executionCount++;

        //log.info("[Execute-Start],user:"+(userHashId==null?"":userHashId)+",count:"+localExecutionCount+",tid:" + params.getOrDefault("tid", ""));

        String triadId = params.get("tid");

        String divWidth = params.containsKey("width") ? params.get("width") : "500";
        params.put("width", "xxxwidthxxx");

        String divHeight = params.containsKey("height") ? params.get("height") : "350";
        params.put("height", "xxxheightxxx");

        TriadCache cacheByTriadId = fetchTriadCacheById(triadId);

//		TriadCache triadCache = performCache ? getCacheByTriadId(triadId, userHashId.toUpperCase()) : null;

        if (cacheByTriadId != null) {

            ObjectMapper mapper = new ObjectMapper();

            Triad triad;

            try {
                String triadJSON = Utils.performGetRequest(
                        baseUrl + "/analyticsmodule/AnalyticsModules/Triads/" + params.getOrDefault("tid", ""));
                triad = mapper.readValue(triadJSON, Triad.class);
            } catch (Exception exc) {
                log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) +
                        ",count:" + localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                        ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                        ",step:tid-parse,code:unknown,msg:" + exc.getMessage());
                throw new ItemNotFoundException("Indicator with id '" +
                        params.getOrDefault("tid", "") + "' not found.", "1");
            }

            if (triad == null) {
                log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                        localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                        ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                        ",step:tid-search,code:tid-notfound");
                throw new ItemNotFoundException("Indicator with id '" +
                        params.getOrDefault("tid", "") + "' not found.", "1");
            }

            OpenLAPDataSet analyzedDataSet = null;

            if (triad.getIndicatorReference().getIndicatorType().equals("Basic Indicator")) {

                Indicator curInd = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());

                if (curInd == null) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:get-query,code:query-notfound");
                    throw new ItemNotFoundException("Indicator with id '" +
                            triad.getIndicatorReference().getIndicators().get("0").getId() + "' not found.", "1");
                }

                QueryParameters curIndQuery = mapper.convertValue(curInd.getQueries().get("0"), QueryParameters.class);

                OpenLAPPortConfigImp openLAPPortConfigImp = mapper.convertValue(
                        triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0"), OpenLAPPortConfigImp.class);

                OpenLAPDataSet queryDataSet = executeIndicatorQuery(curIndQuery, openLAPPortConfigImp, 0);

                if (queryDataSet == null) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:query,code:query-data-empty");
                    throw new ItemNotFoundException("No data found for the indicator with id '" +
                            triad.getIndicatorReference().getIndicators().get("0").getId() + "'.", "1");
                }


                //Applying the analytics method
                try {
                    AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader =
                            analyticsMethodsService.getFolderNameFromResources();
                    AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(
                            triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId(),
                            analyticsMethodsClassPathLoader
                    );
                    Map<String, String> methodParams =
                            triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getAdditionalParams();

                    method.initialize(queryDataSet,
                            triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0"),
                            methodParams
                    );
                    analyzedDataSet = method.execute();
                } catch (AnalyticsMethodInitializationException amexc) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:method-initialize,code:unknown,msg:" + amexc.getMessage());
                    throw new ItemNotFoundException(amexc.getMessage(), "1");
                } catch (Exception exc) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                    throw new ItemNotFoundException(exc.getMessage(), "1");
                }

                if (analyzedDataSet == null) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" + localExecutionCount + ",tid:" + params.getOrDefault("tid", "") + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:analysis,code:analysis-data-empty");
                    throw new ItemNotFoundException("No data returned from the analytics methods with id '" + triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId() + "'.", "1");
                }

			/* **************************************************************************************************************
			COMPOSITE INDICATOR
			************************************************************************************************************** */
            } else if (triad.getIndicatorReference().getIndicatorType().equals("composite")) {

                Indicator curInd = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());

                if (curInd == null) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:get-query,code:query-notfound");
                    throw new ItemNotFoundException("Indicator with id '" +
                            triad.getIndicatorReference().getIndicators().get("0").getId() + "' not found.", "1");
                }

                Set<String> indicatorNames = curInd.getQueries().keySet();
                OpenLAPPortConfigImp methodToVisConfig = triad.getAnalyticsMethodToVisualizationMapping();

                boolean addIndicatorNameColumn = false;
                String columnId = null;
                for (OpenLAPColumnConfigData outputConfig : methodToVisConfig.getOutputColumnConfigurationData()) {
                    if (outputConfig.getId().equals("indicator_names"))
                        addIndicatorNameColumn = true;
                    else
                        columnId = outputConfig.getId();
                }

                for (String indicatorName : indicatorNames) {

                    QueryParameters curIndQuery = curInd.getQueries().get(indicatorName);
                    OpenLAPPortConfigImp queryToMethodConfig = triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get(indicatorName);

                    //curIndQuery = curIndQuery.replace("CourseRoomID", courseID);
                    /*if(curIndQuery.contains("xxxridxxx")) {
                        isPersonalIndicator = true;
                        if(userHashId == null) {
                            log.error("[Execute],user:"+(userHashId==null?"":userHashId)+",count:"+localExecutionCount+",tid:" + params.getOrDefault("tid", "") + ",time:" + (System.currentTimeMillis()-indicatorExecutionStartTime)+",step:rid,code:rid-missing");
                            throw new ItemNotFoundException("This indicator require a user code to generate personalized data which is not provided. Please contact OpenLAP admins with indicator id : " + triad.getId() + ".", "1");
                        }
                        else{
                            curIndQuery = curIndQuery.replace("xxxridxxx", userHashId.toUpperCase());
                        }
                    }*/

                    OpenLAPDataSet queryDataSet = executeIndicatorQuery(curIndQuery, queryToMethodConfig, 0);

                    if (queryDataSet == null) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:query,code:query-data-empty");
                        throw new ItemNotFoundException("No data found for the indicator with id '" +
                                triad.getIndicatorReference().getIndicators().get("0").getId() + "'.", "1");
                    }

                    //try { log.info("Query data: " + mapper.writeValueAsString(queryDataSet)); } catch (Exception exc) {}

                    //Applying the analytics method
                    OpenLAPDataSet singleAnalyzedDataSet = null;
                    try {
                        AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader =
                                analyticsMethodsService.getFolderNameFromResources();
                        AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(
                                triad.getAnalyticsMethodReference().getAnalyticsMethods().get(indicatorName).getId(),
                                analyticsMethodsClassPathLoader
                        );
                        Map<String, String> methodParams =
                                triad.getAnalyticsMethodReference().getAnalyticsMethods().get(indicatorName).getAdditionalParams();

                        method.initialize(queryDataSet, queryToMethodConfig, methodParams);
                        singleAnalyzedDataSet = method.execute();
                    } catch (AnalyticsMethodInitializationException amexc) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:method-initialize,code:unknown,msg:" + amexc.getMessage());
                        throw new ItemNotFoundException(amexc.getMessage(), "1");
                    } catch (Exception exc) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                        throw new ItemNotFoundException(exc.getMessage(), "1");
                    }

                    if (singleAnalyzedDataSet == null) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:analysis,code:analysis-data-empty");
                        throw new ItemNotFoundException("No data returned from the analytics methods with id '" +
                                triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId() + "'.", "1");
                    }

                    //try { log.info("Analyzed data: " + mapper.writeValueAsString(singleAnalyzedDataSet)); } catch (Exception exc) {}

                    //Merging analyzed dataset
                    if (analyzedDataSet == null) {
                        analyzedDataSet = singleAnalyzedDataSet;

                        if (addIndicatorNameColumn)
                            if (!analyzedDataSet.getColumns().containsKey("indicator_names"))
                                try {
                                    analyzedDataSet.addOpenLAPDataColumn(OpenLAPDataColumnFactory.createOpenLAPDataColumnOfType(
                                            "indicator_names",
                                            OpenLAPColumnDataType.Text,
                                            true,
                                            "Indicator Names",
                                            "Names of the indicators combines together to form the composite."
                                    ));
                                } catch (OpenLAPDataColumnException e) {
                                    e.printStackTrace();
                                }
                    } else {
                        List<OpenLAPColumnConfigData> columnConfigDatas = singleAnalyzedDataSet.getColumnsConfigurationData();

                        for (OpenLAPColumnConfigData columnConfigData : columnConfigDatas)
                            analyzedDataSet
                                    .getColumns()
                                    .get(columnConfigData.getId())
                                    .getData()
                                    .addAll(singleAnalyzedDataSet
                                            .getColumns()
                                            .get(columnConfigData.getId())
                                            .getData());
                    }

                    if (addIndicatorNameColumn) {
                        int dataSize = singleAnalyzedDataSet.getColumns().get(columnId).getData().size();

                        for (int i = 0; i < dataSize; i++)
                            analyzedDataSet
                                    .getColumns()
                                    .get("indicator_names")
                                    .getData()
                                    .add(indicatorName);
                    }
                }

                //try { log.info("Combined Analyzed data: " + mapper.writeValueAsString(analyzedDataSet)); } catch (Exception exc) {}

			/* **************************************************************************************************************
			MULTILEVEL INDICATOR
			************************************************************************************************************** */
            } else if (triad.getIndicatorReference().getIndicatorType().equals("multianalysis")) {

                Indicator curInd = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());

                if (curInd == null) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:get-query,code:query-notfound");
                    throw new ItemNotFoundException("Indicator with id '" +
                            triad.getIndicatorReference().getIndicators().get("0").getId() +
                            "' not found.", "1");
                }

                Set<String> indicatorIds = curInd.getQueries().keySet();
                Map<String, OpenLAPDataSet> analyzedDatasetMap = new HashMap<>();

                for (String indicatorId : indicatorIds) {
                    if (indicatorId.equals("0")) // skipping 0 since it is the id for the 2nd level analytics method and it does not have a query
                        continue;

                    QueryParameters curIndQuery = curInd.getQueries().get(indicatorId);
                    OpenLAPPortConfigImp queryToMethodConfig =
                            triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get(indicatorId);

                    /*if(curIndQuery.contains("xxxridxxx")) {
                        isPersonalIndicator = true;
                        if(userHashId == null) {
                            log.error("[Execute],user:"+(userHashId==null?"":userHashId)+",count:"+localExecutionCount+",tid:" + params.getOrDefault("tid", "") + ",time:" + (System.currentTimeMillis()-indicatorExecutionStartTime)+",step:rid,code:rid-missing");
                            throw new ItemNotFoundException("This indicator require a user code to generate personalized data which is not provided. Please contact OpenLAP admins with indicator id : " + triad.getId() + ".", "1");
                        }
                        else{
                            curIndQuery = curIndQuery.replace("xxxridxxx", userHashId.toUpperCase());
                        }
                    }*/

                    OpenLAPDataSet queryDataSet = executeIndicatorQuery(curIndQuery, queryToMethodConfig, 0);

                    if (queryDataSet == null) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:query,code:query-data-empty");
                        throw new ItemNotFoundException("No data found for the indicator with id '" +
                                triad.getIndicatorReference().getIndicators().get("0").getId() + "'.", "1");
                    }

                    //try { log.info("Query data: " + mapper.writeValueAsString(queryDataSet)); } catch (Exception exc) {}

                    //Applying the analytics method
                    OpenLAPDataSet singleAnalyzedDataSet = null;
                    try {
                        AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader =
                                analyticsMethodsService.getFolderNameFromResources();
                        AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(
                                triad.getAnalyticsMethodReference().getAnalyticsMethods().get(indicatorId).getId(),
                                analyticsMethodsClassPathLoader
                        );
                        Map<String, String> methodParams =
                                triad.getAnalyticsMethodReference()
                                        .getAnalyticsMethods()
                                        .get(indicatorId)
                                        .getAdditionalParams();
                        method.initialize(queryDataSet, queryToMethodConfig, methodParams);
                        singleAnalyzedDataSet = method.execute();
                    } catch (AnalyticsMethodInitializationException exc) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:method-initialize,code:unknown,msg:" + exc.getMessage());
                        throw new ItemNotFoundException(exc.getMessage(), "1");
                    } catch (Exception exc) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                        throw new ItemNotFoundException(exc.getMessage(), "1");
                    }

                    if (singleAnalyzedDataSet == null) {
                        log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                                localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                                ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                                ",step:analysis,code:analysis-data-empty");
                        throw new ItemNotFoundException("No data returned from the analytics methods with id '" +
                                triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId() + "'.", "1");
                    }

                    analyzedDatasetMap.put(indicatorId, singleAnalyzedDataSet);

                    //try { log.info("Analyzed data: " + mapper.writeValueAsString(singleAnalyzedDataSet)); } catch (Exception exc) {}
                }

                //mergning dataset
                List<OpenLAPDataSetMergeMapping> mergeMappings = triad.getIndicatorReference().getDataSetMergeMappingList();
                OpenLAPDataSet mergedDataset = null;
                String mergeStatus = "";

                while (mergeMappings.size() > 0) {

                    OpenLAPDataSet firstDataset = null;
                    OpenLAPDataSet secondDataset = null;

                    for (OpenLAPDataSetMergeMapping mergeMapping : mergeMappings) {
                        String key1 = mergeMapping.getIndRefKey1();
                        String key2 = mergeMapping.getIndRefKey2();

                        int dashCountKey1 = StringUtils.countMatches(key1, "-"); //Merged keys will always be in key1

                        if (dashCountKey1 == 0) {
                            firstDataset = analyzedDatasetMap.get(key1);
                            secondDataset = analyzedDatasetMap.get(key2);
                        } else {
                            if (!mergeStatus.isEmpty() && key1.equals(mergeStatus)) {
                                firstDataset = mergedDataset;
                                secondDataset = analyzedDatasetMap.get(key2);
                                key1 = "(" + key1 + ")";
                            } else
                                continue;
                        }

                        OpenLAPDataSet processedDataset = mergeOpenLAPDataSets(firstDataset, secondDataset, mergeMapping);
                        if (processedDataset != null) {
                            mergedDataset = processedDataset;
                            mergeStatus = key1 + "-" + key2;
                            mergeMappings.remove(mergeMapping);
                        }

                        break;
                    }

                }

                //try { log.info("Merged Analyzed data: " + mapper.writeValueAsString(mergedDataset)); } catch (Exception exc) {}


                //Applying the final analysis whose configuration is stored always with id "0"
                OpenLAPPortConfigImp finalQueryToMethodConfig =
                        triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0");
                try {
                    AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader =
                            analyticsMethodsService.getFolderNameFromResources();
                    AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(
                            triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId(),
                            analyticsMethodsClassPathLoader
                    );
                    Map<String, String> methodParams =
                            triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getAdditionalParams();
                    method.initialize(mergedDataset, finalQueryToMethodConfig, methodParams);
                    analyzedDataSet = method.execute();
                } catch (AnalyticsMethodInitializationException amexc) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:method-initialize,code:unknown,msg:" + amexc.getMessage());
                    throw new ItemNotFoundException(amexc.getMessage(), "1");
                } catch (Exception exc) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                    throw new ItemNotFoundException(exc.getMessage(), "1");
                }

                if (analyzedDataSet == null) {
                    log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" +
                            localExecutionCount + ",tid:" + params.getOrDefault("tid", "") +
                            ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) +
                            ",step:analysis,code:final-analysis-data-empty");
                    throw new ItemNotFoundException("No data returned from the analytics methods with id '" +
                            triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId() + "'.", "1");
                }
            }

            //Visualizing the analyzed data
            String indicatorCode = "";
            try {

                Map<String, Object> additionalParams = new HashMap<String, Object>();

                for (Map.Entry<String, String> entry : params.entrySet()) {
                    additionalParams.put(entry.getKey(), entry.getValue());
                }

                GenerateVisualizationCodeRequest visualRequest = new GenerateVisualizationCodeRequest();
                visualRequest.setLibraryId(triad.getVisualizationReference().getLibraryId());
                //visualRequest.setFrameworkName(triad.getVisualizationReference().getFrameworkName());
                visualRequest.setTypeId(triad.getVisualizationReference().getTypeId());
                //visualRequest.setMethodName(triad.getVisualizationReference().getMethodName());
                visualRequest.setDataSet(analyzedDataSet);
                visualRequest.setPortConfiguration(triad.getAnalyticsMethodToVisualizationMapping());
                visualRequest.setParams(additionalParams);

                String visualRequestJSON = mapper.writeValueAsString(visualRequest);
                GenerateVisualizationCodeResponse visualResponse = Utils.performJSONPostRequest(baseUrl + "/generateVisualizationCode", visualRequestJSON, GenerateVisualizationCodeResponse.class);

                indicatorCode = visualResponse.getVisualizationCode();
            } catch (Exception exc) {
                log.error("[Execute],user:" + (userHashId == null ? "" : userHashId) + ",count:" + localExecutionCount + ",tid:" + params.getOrDefault("tid", "") + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-execute,code:unknown,msg:" + exc.getMessage());
                throw new ItemNotFoundException(exc.getMessage(), "1");
            }

            String encodedCode = Utils.encodeURIComponent(indicatorCode);

            if (performCache) {
                if (isPersonalIndicator)
                    saveTriadCache(triadId, userHashId.toUpperCase(), encodedCode);
                else
                    saveTriadCache(triadId, encodedCode);
            }


            encodedCode = encodedCode.replace("xxxwidthxxx", divWidth);
            encodedCode = encodedCode.replace("xxxheightxxx", divHeight);

            log.info("[Execute-New],user:" + (userHashId == null ? "" : userHashId) + ",count:" + localExecutionCount + ",tid:" + params.get("tid") + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime));

            return encodedCode;
        } else {
//			String encodedCode = triadCache.getCode();
            String encodedCode = cacheByTriadId.getCode();

            encodedCode = encodedCode.replace("xxxwidthxxx", divWidth);
            encodedCode = encodedCode.replace("xxxheightxxx", divHeight);

//			log.info("[Execute-Cache],user:" + (userHashId == null ? "" : userHashId) + ",count:" + localExecutionCount + ",tid:" + params.get("tid") + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime));

            return encodedCode;
        }
    }

    public IndicatorSaveResponse getIndicatorRequestCode(String triadId, HttpServletRequest request) {

        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();

        Triad triad = null;
        IndicatorSaveResponse indicatorResponse = new IndicatorSaveResponse();

        try {
            String triadJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/" + triadId);
            triad = mapper.readValue(triadJSON, Triad.class);
        } catch (Exception exc) {
            indicatorResponse.setIndicatorSaved(false);
            indicatorResponse.setErrorMessage("Indicator with triad id '" + triadId + "' not found.");
            return indicatorResponse;
        }

        if (triad == null) {
            indicatorResponse.setIndicatorSaved(false);
            indicatorResponse.setErrorMessage("Indicator with triad id '" + triadId + "' not found.");
        } else {
            indicatorResponse.setIndicatorSaved(true);
//			String iFrameString = "<iframe width="1024" height="800" src="http://localhost:8090/iview?triadID=4ac76c37-e2da-4975-ba52-f41e8816b9ec" />";
            indicatorResponse.setIndicatorRequestCode(getIndicatorRequestCode(triad));
            indicatorResponse.setErrorMessage(triad.getIndicatorReference().getIndicators().get("0").getIndicatorName());
        }

        return indicatorResponse;
    }

    // region Questions
    public Question getQuestionById(String id) {
        Question result = em.find(Question.class, id);
        if (result == null || id == null) {
            throw new ItemNotFoundException("Question with id: {" + id + "} not found", "2");
        } else {
            return result;
        }
    }

    public List<Question> getQuestionsByUserName(String userName) {
        List<Question> questionList = em.createQuery("FROM Question WHERE createdBy = :userName")
                .setParameter("userName", userName)
                .getResultList();

        if (questionList == null) {
            throw new ItemNotFoundException("Username: " + userName + ", not found", "2");
        } else {
            return questionList;
        }
    }


    public List<Triad> getTriadByQuestionId(String questionId) {

        List<QuestionTriad> questionTriadList =
                em.createQuery("FROM QuestionTriad WHERE questionId = :questionId")
                        .setParameter("questionId", questionId)
                        .getResultList();

        ArrayList<Triad> triadList = new ArrayList<>();
        for (QuestionTriad questionTriad : questionTriadList) {
            Triad triad = em.find(Triad.class, questionTriad.getTriadId());
            triadList.add(triad);
        }

        if (triadList == null || questionId == null) {
            throw new ItemNotFoundException("Question with id: {" + questionId + "} not found", "2");
        } else {
            return triadList;
        }
    }

    public OpenLAPDataSet executeIndicatorQuery(QueryParameters queryString, OpenLAPPortConfigImp methodMapping, int rowCount) throws OpenLAPDataColumnException, JSONException, JsonProcessingException {
        OpenLAPDataSet ds;


        OpenLAPDataSet query = statementServiceImp.getAllStatementsByCustomQuery(getId.apply(orgId), getId.apply(lrsId), queryString);


            /*if(rowCount>0)

                query.setMaxResults(rowCount);

            List<?>  dataList = query.getResultList();*/

        // ds = transformIndicatorQueryToOpenLAPDatSet((List<?>) query, methodMapping);


        return query;
    }

    public Question saveQuestion(Question analyticsEngineQuestion) {

        //Question questionToSave = new Question(question.getName(), question.getIndicatorCount(), question.getGoal(), question.getIndicators());
        try {
            tm.begin();
            em.persist(analyticsEngineQuestion);
            //Commit
            em.flush();
//      em.close();
            tm.commit();
//      factory.close();
            return analyticsEngineQuestion;
        } catch (DataIntegrityViolationException mongoException) {
            mongoException.printStackTrace();
            throw new BadRequestException("Question already exists.", "1");
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadRequestException(e.getMessage(), "1");
        }
    }

    public List<QuestionResponse> getQuestions(HttpServletRequest request) {
        List<QuestionResponse> questionsResponse = new ArrayList<QuestionResponse>();

        List<Question> allQuestions = getAllQuestions();

        for (Question question : allQuestions) {
            questionsResponse.add(new QuestionResponse(question.getId(), question.getName(), question.getIndicatorCount()));
        }

        return questionsResponse;
    }

    public List<Question> getAllQuestions() {
        String query = "From Question";
        List<Question> questions = em.createQuery(query).getResultList();
        return questions;
    }

    public Boolean isQuestionNameAvailable(String name) throws ItemNotFoundException {

//		String query = "From Question a where name = " + name + " ";
//		List<Question> result = em.createQuery(query).getResultList();

        String hql = "FROM Question WHERE name = :name";
        Query query = em.createQuery(hql);
        query.setParameter("name", name);

        List result = query.getResultList();

        if (result == null) {
            return true;
        } else {
            return result.size() <= 0;
        }
    }

  /*  public List<Question> searchQuestions(String searchParameter, boolean exactSearch, String colName, String sortDirection, boolean sort) {
        ArrayList<Question> result = new ArrayList<Question>();

        Sort.Direction querySortDirection;
        switch(sortDirection.toLowerCase()){
            case "asc":
                querySortDirection = Sort.Direction.ASC;
                break;
            case "desc":
                querySortDirection = Sort.Direction.DESC;
                break;
            default:
                querySortDirection = Sort.Direction.ASC;
        }

        if(exactSearch) {
            if(sort)

                questionRepository.findByName(searchParameter, new Sort(querySortDirection, colName)).forEach(result::add);
            else
                questionRepository.findByName(searchParameter).forEach(result::add);
        }
        else {
            if(sort)
                questionRepository.findByNameContaining(searchParameter, new Sort(querySortDirection, colName)).forEach(result::add);
            else
                questionRepository.findByNameContaining(searchParameter).forEach(result::add);
        }
        return result;
    }

    public List<Question> getSortedQuestions(String colName, String sortDirection, boolean sort) {
        ArrayList<Question> result = new ArrayList<Question>();

        Sort.Direction querySortDirection;
        switch(sortDirection.toLowerCase()){
            case "asc":
                querySortDirection = Sort.Direction.ASC;
                break;
            case "desc":
                querySortDirection = Sort.Direction.DESC;
                break;
            default:
                querySortDirection = Sort.Direction.ASC;
        }

        if(sort)
            questionRepository.findAll(new Sort(querySortDirection, colName)).forEach(result::add);
        else
            questionRepository.findAll().forEach(result::add);

        return result;
    }*/

    public void deleteQuestion(String id) {

        Question result = em.find(Question.class, id);

        if (result == null || id == null) {
            throw new ItemNotFoundException("Question with id = {" + id + "} not found.", "2");
        } else {
            em.getTransaction().begin();
            em.remove(result);
            em.getTransaction().commit();
        }
    }

    public Boolean validateQuestionName(String name) {
        return isQuestionNameAvailable(name);
    }

    //endregion
    public List<IndicatorResponse> getIndicators(HttpServletRequest request, String userName) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();

        List<IndicatorResponse> indicatorResponses = new ArrayList<IndicatorResponse>();

        try {
            String triadsJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/TriadsByUser?userName=" + userName);
//			List<Triad> triads = mapper.readValue(triadsJSON, mapper.getTypeFactory().constructCollectionType(List.class, Triad.class));
            List<Triad> triads = mapper.readValue(triadsJSON, new TypeReference<List<Triad>>() {
            });
            String indicatorExecutionURL = "http://localhost:8090/iview/indicator?triadID=";
            String heightAndWidth = "height='600px' width='600px'";
            for (Triad triad : triads) {
                Indicator indicator = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());
                String iFrameCodeIndicator = "<iframe src='" + indicatorExecutionURL + triad.getId() +
                        "' frameborder='0'" + heightAndWidth + " />";

                IndicatorResponse indicatorResponse = new IndicatorResponse();
                indicatorResponse.setId(triad.getId());
                indicatorResponse.setQuery(indicator.getQueries());
                indicatorResponse.setIndicatorReference(triad.getIndicatorReference());
                indicatorResponse.setAnalyticsMethodReference(triad.getAnalyticsMethodReference());
                indicatorResponse.setVisualizationReference(triad.getVisualizationReference());
                indicatorResponse.setIndicatorRequestCode(iFrameCodeIndicator);
                indicatorResponse.setQueryToMethodConfig(new HashMap<>());

                for (int i = 0; i < triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().size(); i++) {
                    indicatorResponse.getQueryToMethodConfig().put(String.valueOf(i), triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get(String.valueOf(i)));
                }
                indicatorResponse.setMethodToVisualizationConfig(triad.getAnalyticsMethodToVisualizationMapping());
                indicatorResponse.setName(indicator.getName());
                indicatorResponse.setParameters(triad.getParameters());
                //indicatorResponse.setComposite(indicator.isComposite());
                indicatorResponse.setIndicatorType(triad.getIndicatorReference().getIndicatorType());
                indicatorResponse.setCreatedBy(triad.getCreatedBy());

                indicatorResponses.add(indicatorResponse);
            }
        } catch (Exception exc) {
            throw new ItemNotFoundException("No indicator found", "1");
        }
        return indicatorResponses;
    }

    // 【TODO】 old version
    public List<QuestionIndicatorResponse> getIndicatorsByUserName(HttpServletRequest request, String userName, boolean previewMode) {

        List<Question> questionsByUserName = getQuestionsByUserName(userName);
//        "/AnalyticsModules/Triads"
        List<Triad> triads = new ArrayList<>();
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();
        try {
            String triadsJson = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads");
            triads = mapper.readValue(triadsJson, new TypeReference<List<Triad>>() {
            });
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("!!! triads " + triads);


        ArrayList<QuestionIndicatorResponse> questionSaveRequests = new ArrayList<QuestionIndicatorResponse>();
        String heightAndWidth = null;
        if (previewMode) {
            indicatorExecutionURL = "http://localhost:8090/iview/indicator?preview=true&triadID=";
            heightAndWidth = "height='220px' width='300px'";
        } else {
            indicatorExecutionURL = "http://localhost:8090/iview/indicator?triadID=";
            heightAndWidth = "height='600px' width='600px'";

        }
        System.out.println("heightAndWidth = " + heightAndWidth);
        Question question1 = new Question();
        List<IndicatorResponse> triadIdList = getIndicatorsByQuestionId(triads, "");

        for (Triad question : triads) {
//            List<Triad> triadList = getTriadByQuestionId(question.getId());
//            AnalyticsGoal goal = triadList.get(0).getGoal();
            AnalyticsGoal goal = new AnalyticsGoal();

            List<IndicatorSaveResponse> indicatorSaveResponses = new ArrayList<IndicatorSaveResponse>();

            for (IndicatorResponse triad : triadIdList) {
                IndicatorSaveResponse indicatorSaveResponse = new IndicatorSaveResponse();


                String iFrameCodeIndicator = "<iframe src='" + indicatorExecutionURL + triad.getId() +
                        "' frameborder='0'" + heightAndWidth + " />";

                indicatorSaveResponse.setIndicatorSaved(true);
                indicatorSaveResponse.setIndicatorClientID(triad.getId());
                indicatorSaveResponse.setIndicatorRequestCode(iFrameCodeIndicator);

                indicatorSaveResponses.add(indicatorSaveResponse);
            }
            int width = 0;
            int height = 0;
            if (triadIdList.size() > 1) {
                width = 1400;
                int round = triadIdList.size() / 2;
                if (triadIdList.size() % 2 == 1)
                    round = round + 1;
                height = 800 * round;
                System.out.println(height);
            } else {
                width = 700;
                height = 800;
            }

            String iFrameCodeQuestion = "<iframe src='" + questionExecutionURL + "?questionId=" + question.getId() +
                    "' frameborder='0' height='" + height + "px' width='" + width + "px' />";

            QuestionIndicatorResponse questionSaveRequest =
                    new QuestionIndicatorResponse(question1, goal, triadIdList, indicatorSaveResponses, iFrameCodeQuestion);

            questionSaveRequests.add(questionSaveRequest);
        }
        return questionSaveRequests;
    }

    // 【TODO】 old version2
    public List<QuestionIndicatorResponse> getIndicatorResponse(HttpServletRequest request, String userName, boolean previewMode) {

        List<Question> questionsByUserName = getQuestionsByUserName(userName);
//        "/AnalyticsModules/Triads"
        List<Triad> triads = new ArrayList<>();
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();
        try {
            String triadsJson = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads");
            triads = mapper.readValue(triadsJson, new TypeReference<List<Triad>>() {
            });
        } catch (Exception e) {
            e.printStackTrace();
        }


        ArrayList<QuestionIndicatorResponse> questionSaveRequests = new ArrayList<QuestionIndicatorResponse>();
        String heightAndWidth = null;
        if (previewMode) {
            indicatorExecutionURL = "http://localhost:8090/iview/indicator?preview=true&triadID=";
            heightAndWidth = "height='320px' width='400px'";
        } else {
            indicatorExecutionURL = "http://localhost:8090/iview/indicator?triadID=";
            heightAndWidth = "height='600px' width='600px'";

        }
        System.out.println("heightAndWidth = " + heightAndWidth);
        Question question1 = new Question();

//            List<Triad> triadList = getTriadByQuestionId(question.getId());
//            AnalyticsGoal goal = triadList.get(0).getGoal();
        AnalyticsGoal goal = new AnalyticsGoal();
        List<IndicatorResponse> triadIdList = getIndicatorsByQuestionId(triads, "");

        List<IndicatorSaveResponse> indicatorSaveResponses = new ArrayList<IndicatorSaveResponse>();

        for (IndicatorResponse triad : triadIdList) {
            IndicatorSaveResponse indicatorSaveResponse = new IndicatorSaveResponse();


            String iFrameCodeIndicator = "<iframe src='" + indicatorExecutionURL + triad.getId() +
                    "' frameborder='0'" + heightAndWidth + " />";

            indicatorSaveResponse.setIndicatorSaved(true);
            indicatorSaveResponse.setIndicatorClientID(triad.getId());
            indicatorSaveResponse.setIndicatorRequestCode(iFrameCodeIndicator);

            indicatorSaveResponses.add(indicatorSaveResponse);
        }
        int width = 0;
        int height = 0;
        if (triadIdList.size() > 1) {
            width = 1400;
            int round = triadIdList.size() / 2;
            if (triadIdList.size() % 2 == 1)
                round = round + 1;
            height = 800 * round;
            System.out.println(height);
        } else {
            width = 700;
            height = 800;
        }

        String iFrameCodeQuestion = "<iframe src='" + questionExecutionURL + "?questionId=" + "" +
                "' frameborder='0' height='" + height + "px' width='" + width + "px' />";

        QuestionIndicatorResponse questionSaveRequest =
                new QuestionIndicatorResponse(question1, goal, triadIdList, indicatorSaveResponses, iFrameCodeQuestion);

        questionSaveRequests.add(questionSaveRequest);
        return questionSaveRequests;
    }

    /**
     * Different from getIndicatorsByUserName, return a preview list
     * that Composite & Multi-level Indicator needs.
     *
     * @author Ao
     */

    public List<BasicIndicatorPreview> getIndicatorsPreviewByUserName(HttpServletRequest request, String userName) {
        List<QuestionIndicatorResponse> indicatorsByUserName = getIndicatorResponse(request, userName, true);
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();


        AnalyticsMethods analyticsMethods = new AnalyticsMethods();
        String methodsJSON = null;

        ArrayList<BasicIndicatorPreview> basicIndicatorPreviewArrayList = new ArrayList();
        ArrayList<IndicatorResponse> indicatorResponses = new ArrayList<>();
        ArrayList<IndicatorSaveResponse> indicatorSaveResponses = new ArrayList<>();

        indicatorsByUserName.forEach(e -> {
            indicatorSaveResponses.addAll(e.getIndicatorSaveResponses());
            indicatorResponses.addAll(e.getIndicators());
        });

        for (int i = 0; i < indicatorSaveResponses.size(); i++) {
            BasicIndicatorPreview basicIndicatorPreview = new BasicIndicatorPreview();
            basicIndicatorPreview.setIndicatorRequestCode(indicatorSaveResponses.get(i).getIndicatorRequestCode());
            basicIndicatorPreview.setMethodParams(indicatorResponses.get(i).getAnalyticsMethodReference().getAnalyticsMethods().get("0").getAdditionalParams());
            basicIndicatorPreviewArrayList.add(basicIndicatorPreview);
        }
        for (int i = 0; i < indicatorResponses.size(); i++) {
            BasicIndicatorPreview basicIndicatorPreview = basicIndicatorPreviewArrayList.get(i);
            IndicatorResponse indicatorResponse = indicatorResponses.get(i);
            basicIndicatorPreview.setIndicators(Arrays.asList(indicatorResponse));
            basicIndicatorPreview.setId(indicatorResponse.getId());
            basicIndicatorPreview.setName(indicatorResponse.getName());

            basicIndicatorPreview.setAnalyticsMethodId(indicatorResponse.getAnalyticsMethodReference().getAnalyticsMethods().get("0").getId());
            try {
                methodsJSON = Utils.performGetRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + basicIndicatorPreview.getAnalyticsMethodId());
                analyticsMethods = mapper.readValue(methodsJSON, AnalyticsMethods.class);
            } catch (Exception e) {
                e.printStackTrace();
            }
            basicIndicatorPreview.setAnalyticsMethodName(analyticsMethods.getName());
        }
        return basicIndicatorPreviewArrayList;
    }

    public List<IndicatorResponse> getIndicatorsByQuestionId(List<Triad> triads, String questionId) {


        List<Triad> triadIdList = getTriadByQuestionId(questionId);

//		Question question = getQuestionById(questionId);
        List<IndicatorResponse> indicators = new ArrayList<IndicatorResponse>();

        for (Triad triad : triads) {
            System.out.println("triads: " + triad);
            Indicator indicator = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());

            IndicatorResponse indicatorResponse = new IndicatorResponse();
            indicatorResponse.setId(triad.getId());
            indicatorResponse.setQuery(indicator.getQueries());
            indicatorResponse.setIndicatorReference(triad.getIndicatorReference());
            //indicatorResponse.setAnalyticsMethodReference(triad.getAnalyticsMethodReference().getAnalyticsMethods().get("0"));
            indicatorResponse.setAnalyticsMethodReference(triad.getAnalyticsMethodReference());
            indicatorResponse.setVisualizationReference(triad.getVisualizationReference());
            //indicatorResponse.setQueryToMethodConfig(triad.getIndicatorToAnalyticsMethodMapping());
            indicatorResponse.setQueryToMethodConfig(new HashMap<>());
            // @author Louis Born <louis.born@stud.uni-due.de>
            // The following code causes composite and multi-level preview error as it has missing method config!!
            // Wrong: indicatorResponse.getQueryToMethodConfig().put("0", triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0"));
            // Solution: Iterate over the keys of triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs()
            for (String key : triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().keySet()) {
                indicatorResponse.getQueryToMethodConfig().put(key, triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get(key));
            }
            indicatorResponse.setMethodToVisualizationConfig(triad.getAnalyticsMethodToVisualizationMapping());
            indicatorResponse.setName(indicator.getName());
            indicatorResponse.setParameters(triad.getParameters());
            //indicatorResponse.setComposite(indicator.isComposite());
            indicatorResponse.setIndicatorType(triad.getIndicatorReference().getIndicatorType());
            indicatorResponse.setCreatedBy(triad.getCreatedBy());
            indicatorResponse.setOutputs(triad.getOpenLAPDataSet());
            indicators.add(indicatorResponse);
            System.out.println("indicator " + indicatorResponse);
        }

        return indicators;
    }

    public Indicator getIndicatorById(String id) throws ItemNotFoundException {

        Indicator result = em.find(Indicator.class, id);
        if (result == null || id == null) {
            throw new ItemNotFoundException("Indicator with id: {" + id + "} not found", "1");
        } else {
            return result;
        }
    }

    public Boolean isIndicatorNameAvailable(String name) throws ItemNotFoundException {

        String hql = "FROM Indicator WHERE name = :name";
        Query query = em.createQuery(hql);
        query.setParameter("name", name);

        List result = query.getResultList();

//		String Query = "From Indicator where name = " + name + "";
//		List<Indicator> result = em.createQuery(Query).getResultList();
        if (result == null) {
            return true;
        } else {
            return result.size() <= 0;
        }
    }


    public Indicator saveIndicator(Indicator indicator) {
        try {
            em.getTransaction().begin();
            em.persist(indicator);
            //Commit
            em.flush();
//            em.close();
            tm.commit();
            return indicator;
        } catch (DataIntegrityViolationException mongoException) {
            mongoException.printStackTrace();
            throw new BadRequestException("Indicator already exists.", "2");
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadRequestException(e.getMessage(), "2");
        }
    }

    public Boolean validateIndicatorName(String name) {
        return isIndicatorNameAvailable(name);
    }

    //region TriadCache repository methods


    public TriadCache saveTriadCache(String triadId, String code) {

        TriadCache triadCache = new TriadCache(triadId, code);
        try {

            em.getTransaction().begin();
            em.persist(triadCache);
            em.flush();
            em.getTransaction().commit();

            return triadCache;

        } catch (DataIntegrityViolationException sqlException) {
            sqlException.printStackTrace();
            throw new BadRequestException("Cache already exists.", "1");
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadRequestException(e.getMessage(), "1");
        }
    }

    public TriadCache saveTriadCache(String triadId, String userHash, String code) {

        TriadCache triadCache = new TriadCache(triadId, userHash, code);
        try {

            em.getTransaction().begin();
            em.persist(triadCache);
            em.getTransaction().commit();
            em.flush();
            return triadCache;
        } catch (DataIntegrityViolationException sqlException) {
            sqlException.printStackTrace();
            throw new BadRequestException("Cache already exists.", "1");
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadRequestException(e.getMessage(), "1");
        }
    }

    //endregion
    //region indicator preview
    public IndicatorPreviewResponse getIndicatorPreview(IndicatorPreviewRequest previewRequest, String baseUrl) {
        // TODO 【FLAG】 BASIC INDICATOR
        long indicatorExecutionStartTime = System.currentTimeMillis();
        long localPreviewCount = previewCount++;
        IndicatorPreviewResponse response = new IndicatorPreviewResponse();
        try {
            // JSON 实例对象-基于jackson
            ObjectMapper mapper = new ObjectMapper();
            // 获取请求体的["queries"]
            QueryParameters curIndQuery = previewRequest.getQueries().get("0");
            // 获取请求体的的["queryToMethodConfig"]
            OpenLAPPortConfigImp queryToMethodConfig = previewRequest.getQueryToMethodConfig().get("0");
/*
                if(curIndQuery !=null) {
                if(!previewRequest.getAdditionalParams().containsKey("rid")){
                    response.setSuccess(false);
                    response.setErrorMessage("This indicator require a user code to generate personalized data which is not provided. Try again after refreshing the web page.");
                    log.error("[Preview-Simple-End],count:"+localPreviewCount+",time:" + (System.currentTimeMillis()-indicatorExecutionStartTime)+",step:rid,code:rid-missing");
                    return response;
                }
                else{
                    String userID = previewRequest.getAdditionalParams().get("rid").toString().toUpperCase();
                    //curIndQuery = curIndQuery.replace("xxxridxxx", userID);
                    }
            }*/
            // 查库：根据查询条件获取所有的Statements
            OpenLAPDataSet queryDataSet = statementServiceImp.getAllStatementsByCustomQuery(getId.apply(orgId), getId.apply(lrsId), curIndQuery);


            if (queryDataSet == null) {
                // 如果没有查询到结果，则报错，并返回。
                response.setSuccess(false);
                response.setErrorMessage("No data found for the indicator. Try Changing the selections in 'Dataset' and 'Filters' sections");
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:query,code:query-data-empty");
                return response;
            }

            //Validating the analytics method
            try {
                // 如果查询到结果，首先验证该AnalyticsMethod 是否存在。
                String methodValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + previewRequest.getAnalyticsMethodId().get("0") + "/validateConfiguration", queryToMethodConfig.toString());


                // jackson 序列化 JsonString -> OpenLapDataSetConfigValidationResult
                OpenLAPDataSetConfigValidationResult methodValid = mapper.readValue(methodValidJSON, OpenLAPDataSetConfigValidationResult.class);

                if (!methodValid.isValid()) {
                    // 如果返回的Config是有效的，（是否有效，在 AnalyticsMethodsController中 有具体的描述，和步骤，见TODO 【FLAG】 校验methods）
                    response.setSuccess(false);
                    response.setErrorMessage(methodValid.getValidationMessage());
                    log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-validate,code:unknown,msg:" + methodValid.getValidationMessage());
                    return response;
                }

            } catch (Exception exc) {
                response.setSuccess(false);
                response.setErrorMessage("An unknown error occurred while validating the inputs to analysis. please contact the admins with the following error: " + exc.getMessage());
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-validate,code:unknown,msg:" + exc.getMessage());
                return response;
            }

            //Applying the analytics method
            OpenLAPDataSet analyzedDataSet = null;
            try {
                // 获取 ./analyticsMethodsJars/AnalyticsMethods-Prototypes-1.0-SNAPSHOT.jar
                AnalyticsMethodsClassPathLoader classPathLoader = analyticsMethodsService.getFolderNameFromResources();
                AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(previewRequest.getAnalyticsMethodId().get("0"), classPathLoader);
                // 获取方法的参数列表
                String rawMethodParams = previewRequest.getMethodInputParams().containsKey("0") ? previewRequest.getMethodInputParams().get("0") : "";
                // jackson ObjectMapper.readValue 将json转为Map
                Map<String, String> methodParams = rawMethodParams.isEmpty() ? new HashMap<>() : mapper.readValue(rawMethodParams, new TypeReference<HashMap<String, String>>() {
                });

                method.initialize(queryDataSet, queryToMethodConfig, methodParams);
                System.out.println(queryDataSet);
                // TODO 【FLAG】这里有点问题，method.execute() 找不到里面implementationExecution() 的实现类，但是这个方法会返回一个OpenLAPDataSet对象
                analyzedDataSet = method.execute();
            } catch (AnalyticsMethodInitializationException amexc) {
                response.setSuccess(false);
                response.setErrorMessage("An unknown error occurred while starting the analysis. please contact the admins with the following error: " + amexc.getMessage());
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-initialize,code:unknown,msg:" + amexc.getMessage());
                return response;
            } catch (Exception exc) {
                response.setSuccess(false);
                response.setErrorMessage("An unknown error occurred while performing the analysis. please contact the admins with the following error: " + exc.getMessage());
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                return response;
            }


            if (analyzedDataSet == null) {
                response.setSuccess(false);
                response.setErrorMessage("No analyzed data was generated from the analytics method");
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:analysis,code:analysis-data-empty");
                return response;
            }

            //try { log.info("Analyzed data: " + mapper.writeValueAsString(analyzedDataSet)); } catch (Exception exc) { }


            //visualizing the analyzed data
            // 生成 IndicatorCode 阶段---------------
            String indicatorCode = "";
            // 配置生成的图像的X、Y轴。
            OpenLAPPortConfigImp methodToVisConfig = previewRequest.getMethodToVisualizationConfig();


            //Validating the visualization technique
            try {
                ValidateVisualizationTypeConfigurationRequest visRequest = new ValidateVisualizationTypeConfigurationRequest();

                visRequest.setConfigurationMapping(methodToVisConfig);
                String visRequestJSON = mapper.writeValueAsString(visRequest);

                // 远程调用/frameworks/ 中的相关接口 校验visualization的jar中的配置是否与传进来的参数相匹配。
                ValidateVisualizationTypeConfigurationResponse visValid = Utils.performJSONPostRequest(baseUrl + "/frameworks/" + previewRequest.getVisualizationLibraryId() + "/methods/" + previewRequest.getVisualizationTypeId() + "/validateConfiguration", visRequestJSON, ValidateVisualizationTypeConfigurationResponse.class);

                if (!visValid.isConfigurationValid()) {
                    response.setSuccess(false);
                    response.setErrorMessage(visValid.getValidationMessage());
                    log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-validate,code:unknown,msg:" + visValid.getValidationMessage());
                    return response;
                }

            } catch (Exception exc) {
                response.setSuccess(false);
                response.setErrorMessage(exc.getMessage());
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-validate,code:unknown,msg:" + exc.getMessage());
                return response;
            }


            try {
                GenerateVisualizationCodeRequest visualRequest = new GenerateVisualizationCodeRequest();
                visualRequest.setLibraryId(previewRequest.getVisualizationLibraryId());
                visualRequest.setTypeId(previewRequest.getVisualizationTypeId());
                visualRequest.setDataSet(analyzedDataSet);
                visualRequest.setPortConfiguration(methodToVisConfig);
                visualRequest.setParams(previewRequest.getAdditionalParams());

                String visualRequestJSON = mapper.writeValueAsString(visualRequest);

                // TODO [FLAG] Call the generateVisualizationCode interface to generate VisualizationCode
                GenerateVisualizationCodeResponse visualResponse = Utils.performJSONPostRequest(baseUrl + "/generateVisualizationCode", visualRequestJSON, GenerateVisualizationCodeResponse.class);

                indicatorCode = visualResponse.getVisualizationCode();
            } catch (Exception exc) {
                response.setSuccess(false);
                response.setErrorMessage(exc.getMessage());
                log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-execute,code:unknown,msg:" + exc.getMessage());
                return response;
            }

            response.setSuccess(true);
            response.setErrorMessage("");
            response.setVisualizationCode(Utils.encodeURIComponent(indicatorCode));

            String basicIndicator = "%3Cdiv%20id%3D'chartdiv_1665608929513'%3E%3C%2Fdiv%3E%3Cscript%20type%3D'text%2Fjavascript'%3E%20var%20width_1665608929513%20%3D%20400%3Bvar%20height_1665608929513%20%3D%20500%3Bvar%20chart_1665608929513%20%3D%20c3.generate(%7Bbindto%3A%20'%23chartdiv_1665608929513'%2C%20size%3A%20%7B%20width%3A%20(width_1665608929513%20-%2020)%2C%20height%3A%20(height_1665608929513%20-%2020)%20%7D%2C%20data%3A%20%7Bcolumns%3A%20%5B%20%5B'MAP%20Vorbereitungskurs%20Vorlesung%20A2'%2C%2014%5D%2C%5B'Moderne%20Webtechnologien%20(Microcourse)'%2C%201923%5D%2C%5B'Moderne%20Webframeworks%20(Microcourse)'%2C%201227%5D%2C%5B'Testkurs%20(Bochum)'%2C%20392%5D%2C%5B'Testkurs%20(Sebastian%2C%20Diss%20Studie)'%2C%2087%5D%2C%5B'Visualisierungen%20(L%EF%BF%BDbeck)'%2C%2041%5D%2C%5B'Visualisierungen'%2C%202%5D%20%5D%2C%20type%3A%20'pie'%7D%20%7D)%3B%3C%2Fscript%3E";
            String compositeIndicator = "%3Cdiv%20id%3D'chartdiv_1665608929513'%3E%3C%2Fdiv%3E%3Cscript%20type%3D'text%2Fjavascript'%3E%20var%20width_1665608929513%20%3D%20400%3Bvar%20height_1665608929513%20%3D%20500%3Bvar%20chart_1665608929513%20%3D%20c3.generate(%7Bbindto%3A%20'%23chartdiv_1665608929513'%2C%20size%3A%20%7B%20width%3A%20(width_1665608929513%20-%2020)%2C%20height%3A%20(height_1665608929513%20-%2020)%20%7D%2C%20data%3A%20%7Bcolumns%3A%20%5B%20%5B'MAP%20Vorbereitungskurs%20Vorlesung%20A2'%2C%2014%5D%2C%5B'Moderne%20Webtechnologien%20(Microcourse)'%2C%201923%5D%2C%5B'Moderne%20Webframeworks%20(Microcourse)'%2C%201227%5D%2C%5B'Testkurs%20(Bochum)'%2C%20392%5D%2C%5B'Testkurs%20(Sebastian%2C%20Diss%20Studie)'%2C%2087%5D%2C%5B'Visualisierungen%20(L%EF%BF%BDbeck)'%2C%2041%5D%2C%5B'Visualisierungen'%2C%202%5D%20%5D%2C%20type%3A%20'pie'%7D%20%7D)%3B%3C%2Fscript%3E";
            String multiLevelIndicatrMork = "%3Cdiv%20id%3D'chartdiv_1669757523832'%3E%3C%2Fdiv%3E%3Cscript%20type%3D'text%2Fjavascript'%3E%20var%20width_1669757523832%20%3D%20400%3Bvar%20height_1669757523832%20%3D%20500%3Bvar%20chart_1669757523832%20%3D%20c3.generate(%7Bbindto%3A%20'%23chartdiv_1669757523832'%2C%20size%3A%20%7B%20width%3A%20(width_1669757523832%20-%2020)%2C%20height%3A%20(height_1669757523832%20-%2020)%20%7D%2C%20legend%3A%20%7B%20position%3A%20'inset'%20%7D%2C%20data%3A%20%7B%20xs%3A%7BCluster1%3A'Cluster1_x'%2CCluster3%3A'Cluster3_x'%2CCluster2%3A'Cluster2_x'%2CCluster5%3A'Cluster5_x'%2CCluster4%3A'Cluster4_x'%7D%2Ccolumns%3A%20%5B%20%5B'Cluster1_x'%2C%2078.0%2C%2060.0%2C%2077.0%2C%2067.0%2C%2073.0%2C%2071.0%2C%2066.0%2C%2061.0%2C%2065.0%2C%2068.0%2C%2059.0%2C%2076.0%2C%2070.0%2C%2072.0%2C%2063.0%2C%2064.0%2C%2074.0%2C%2069.0%2C%2075.0%2C%2079.0%2C%2062.0%5D%2C%5B'Cluster1'%2C%2025.0%2C%2021.0%2C%201.0%2C%2030.0%2C%2014.0%2C%2049.0%2C%203.0%2C%201.0%2C%2051.0%2C%2040.0%2C%2014.0%2C%2018.0%2C%2016.0%2C%202.0%2C%2055.0%2C%2034.0%2C%2068.0%2C%2022.0%2C%205.0%2C%2010.0%2C%208.0%5D%2C%5B'Cluster3_x'%2C%2086.0%2C%2092.0%2C%2091.0%2C%2085.0%2C%2088.0%2C%2087.0%2C%2084.0%2C%2090.0%2C%2083.0%2C%2082.0%2C%2095.0%2C%2089.0%2C%2094.0%2C%2081.0%2C%2080.0%5D%2C%5B'Cluster3'%2C%2075.0%2C%202.0%2C%201.0%2C%20276.0%2C%201.0%2C%20100.0%2C%209.0%2C%201.0%2C%2030.0%2C%20117.0%2C%202.0%2C%201.0%2C%201.0%2C%202.0%2C%2038.0%5D%2C%5B'Cluster2_x'%2C%2028.0%2C%2016.0%2C%2017.0%2C%2022.0%2C%2024.0%2C%2023.0%2C%2012.0%2C%202.0%2C%207.0%2C%2014.0%2C%2026.0%2C%2010.0%2C%2015.0%2C%2021.0%2C%203.0%2C%2011.0%2C%2031.0%2C%2029.0%2C%2030.0%2C%2020.0%2C%2033.0%2C%2013.0%2C%2027.0%5D%2C%5B'Cluster2'%2C%2011.0%2C%2014.0%2C%2061.0%2C%202099.0%2C%2034.0%2C%2025.0%2C%201098.0%2C%20394.0%2C%203.0%2C%20174.0%2C%201.0%2C%205.0%2C%20188.0%2C%207.0%2C%20278.0%2C%20916.0%2C%2054.0%2C%20258.0%2C%202.0%2C%203.0%2C%20180.0%2C%2025.0%2C%206.0%5D%2C%5B'Cluster5_x'%2C%20104.0%2C%20106.0%2C%2097.0%2C%2096.0%2C%20105.0%2C%20107.0%2C%20100.0%2C%20102.0%2C%20101.0%2C%2099.0%2C%2098.0%2C%20103.0%2C%20108.0%5D%2C%5B'Cluster5'%2C%202.0%2C%202.0%2C%2010.0%2C%201.0%2C%209.0%2C%206.0%2C%2013.0%2C%209.0%2C%202.0%2C%208.0%2C%208.0%2C%202.0%2C%202.0%5D%2C%5B'Cluster4_x'%2C%2045.0%2C%2057.0%2C%2049.0%2C%2052.0%2C%2058.0%2C%2055.0%2C%2036.0%2C%2048.0%2C%2051.0%2C%2050.0%2C%2046.0%2C%2032.0%2C%2047.0%2C%2039.0%2C%2053.0%2C%2042.0%2C%2041.0%2C%2043.0%2C%2038.0%2C%2044.0%2C%2037.0%2C%2056.0%2C%2035.0%5D%2C%5B'Cluster4'%2C%204.0%2C%20104.0%2C%2051.0%2C%2066.0%2C%2046.0%2C%201.0%2C%2027.0%2C%2051.0%2C%2033.0%2C%201.0%2C%2038.0%2C%206.0%2C%2050.0%2C%20109.0%2C%2059.0%2C%2032.0%2C%203.0%2C%2050.0%2C%2071.0%2C%2027.0%2C%20104.0%2C%2088.0%2C%201.0%5D%5D%2C%20type%3A%20'scatter'%20%7D%7D)%3B%3C%2Fscript%3E";
            String multiLevelReal = "%3Cdiv%20id%3D'chartdiv_1670363301523'%3E%3C%2Fdiv%3E%3Cscript%20type%3D'text%2Fjavascript'%3E%20var%20width_1670363301523%20%3D%20400%3Bvar%20height_1670363301523%20%3D%20500%3Bvar%20chart_1670363301523%20%3D%20c3.generate(%7Bbindto%3A%20'%23chartdiv_1670363301523'%2C%20size%3A%20%7B%20width%3A%20(width_1670363301523%20-%2020)%2C%20height%3A%20(height_1670363301523%20-%2020)%20%7D%2C%20legend%3A%20%7B%20position%3A%20'inset'%20%7D%2C%20data%3A%20%7B%20xs%3A%7BCluster1%3A'Cluster1_x'%7D%2Ccolumns%3A%20%5B%20%5B'Cluster1_x'%2C%2014.0%5D%2C%5B'Cluster1'%2C%2014.0%5D%5D%2C%20type%3A%20'scatter'%20%7D%7D)%3B%3C%2Fscript%3E";
            String multi2 = "%3Cdiv%20id%3D'chartdiv_1670957174241'%3E%3C%2Fdiv%3E%3Cscript%20type%3D'text%2Fjavascript'%3E%20var%20width_1670957174241%20%3D%20400%3Bvar%20height_1670957174241%20%3D%20500%3Bvar%20chart_1670957174241%20%3D%20c3.generate(%7Bbindto%3A%20'%23chartdiv_1670957174241'%2C%20size%3A%20%7B%20width%3A%20(width_1670957174241%20-%2020)%2C%20height%3A%20(height_1670957174241%20-%2020)%20%7D%2C%20legend%3A%20%7B%20position%3A%20'inset'%20%7D%2C%20data%3A%20%7B%20xs%3A%7BCluster1%3A'Cluster1_x'%2CCluster3%3A'Cluster3_x'%2CCluster2%3A'Cluster2_x'%7D%2Ccolumns%3A%20%5B%20%5B'Cluster1_x'%2C%201900.0%5D%2C%5B'Cluster1'%2C%202476.0%5D%2C%5B'Cluster3_x'%2C%201193.0%5D%2C%5B'Cluster3'%2C%20891.0%5D%2C%5B'Cluster2_x'%2C%20389.0%5D%2C%5B'Cluster2'%2C%20617.0%5D%5D%2C%20type%3A%20'scatter'%20%7D%7D)%3B%3C%2Fscript%3E";
//            multi2 = "%3Cdiv%20id%3D'chartdiv_1682684064370'%3E%3C%2Fdiv%3E%3Cscript%20type%3D'text%2Fjavascript'%3E%20var%20width_1682684064370%20%3D%20700%3Bvar%20height_1682684064370%20%3D%20600%3Bvar%20chart_1682684064370%20%3D%20c3.generate(%7Bbindto%3A%20'%23chartdiv_1682684064370'%2C%20size%3A%20%7B%20width%3A%20(width_1682684064370%20-%2020)%2C%20height%3A%20(height_1682684064370%20-%2020)%20%7D%2C%20legend%3A%20%7B%20position%3A%20'inset'%20%7D%2C%20data%3A%20%7B%20xs%3A%7BCluster1%3A'Cluster1_x'%2CCluster5%3A'Cluster5_x'%2CCluster2%3A'Cluster2_x'%2CCluster3%3A'Cluster3_x'%2CCluster4%3A'Cluster4_x'%7D%2Ccolumns%3A%20%5B%20%5B'Cluster1_x'%2C%2016.0%5D%2C%5B'Cluster1'%2C%208.0%5D%2C%5B'Cluster5_x'%2C%2011.0%5D%2C%5B'Cluster5'%2C%2012.0%5D%2C%5B'Cluster2_x'%2C%208.0%5D%2C%5B'Cluster2'%2C%2016.0%5D%2C%5B'Cluster3_x'%2C%206.0%5D%2C%5B'Cluster3'%2C%2020.0%5D%2C%5B'Cluster4_x'%2C%205.0%5D%2C%5B'Cluster4'%2C%2027.0%5D%5D%2C%20type%3A%20'scatter'%20%7D%7D)%3B%3C%2Fscript%3E";
//            response.setVisualizationCode(multi2);
//
            log.info("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime));

            return response;
        } catch (Exception exc) {
            response.setSuccess(false);
            response.setErrorMessage(exc.getMessage());
            log.error("[Preview-Simple-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:indicator-preview,code:unknown,msg:" + exc.getMessage());
            return response;
        }
    }

    public IndicatorPreviewResponse getCompIndicatorPreview(IndicatorPreviewRequest previewRequest, String baseUrl) {
        long indicatorExecutionStartTime = System.currentTimeMillis();
        long localPreviewCount = previewCount++;

        IndicatorPreviewResponse response = new IndicatorPreviewResponse();
        try {
            ObjectMapper mapper = new ObjectMapper();

            try {
                log.info("[Preview-Composite-Start],user:" + previewRequest.getAdditionalParams().get("uid").toString() + ",count:" + localPreviewCount + ",param:" + mapper.writeValueAsString(previewRequest));
            } catch (Exception exc) {
            }

            // Compared with the basic indicator parameter, there is one more IndicatorType parameter here, which specifies the current indicator type.
            if (previewRequest.getIndicatorType().equals("composite")) {

                Set<String> indicatorNames = previewRequest.getQueries().keySet();
                OpenLAPPortConfigImp methodToVisConfig = previewRequest.getMethodToVisualizationConfig();

                boolean addIndicatorNameColumn = false;
                String columnId = null;
                // methodToVisConfig.getOutputColumnConfigurationData() This method reassembles all the values of methodToVisualizationConfig.mapping[*].outputPort into an ArrayList and returns it.
                for (OpenLAPColumnConfigData outputConfig : methodToVisConfig.getOutputColumnConfigurationData()) {
                    if (outputConfig.getId().equals("indicator_names"))
                        addIndicatorNameColumn = true;
                    else
                        columnId = outputConfig.getId();
                }

                OpenLAPDataSet combinedAnalyzedDataSet = null;
                TreeMap<String, Integer> analyticsTreeMap = new TreeMap<>();
                ArrayList<HashMap<Object,Object>> analyticsHashMapList = new ArrayList<>();
                ArrayList<Map<String,Integer>> analyticsTreeMaps = new ArrayList<>();
                // Composit involves multiple queries
                for (String indicatorName : indicatorNames) {


                    // 获取当前操作的indicator
                    QueryParameters curIndQuery = previewRequest.getQueries().get(indicatorName);
                    OpenLAPPortConfigImp queryToMethodConfig = previewRequest.getQueryToMethodConfig().get(indicatorName);

                    if (curIndQuery != null) {
                        // If the additionalParams parameter does not contain the "rid" field, return false.
                        if (!previewRequest.getAdditionalParams().containsKey("rid")) {
                            response.setSuccess(false);
                            response.setErrorMessage("This indicator require a user code to generate personalized data which is not provided. Try again after refreshing the web page.");
                            log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:rid,code:rid-missing");
                            return response;
                        } else {
                            // TODO 【FLAG】rid gennerate userId
                            String userID = previewRequest.getAdditionalParams().get("rid").toString().toUpperCase();
                            // curIndQuery = curIndQuery.replace("xxxridxxx", userID);
                        }
                    }

                    //OpenLAPDataSet queryDataSet = executeIndicatorQuery(previewRequest, queryToMethodConfig, 0);
                    // Obtain lrs data according to custom query conditions
                    OpenLAPDataSet queryDataSet = statementServiceImp.getAllStatementsByCustomQuery(getId.apply(orgId), getId.apply(lrsId), curIndQuery);

                    if (queryDataSet == null) {
                        response.setSuccess(false);
                        response.setErrorMessage("No data found for the indicator '" + indicatorName + "'. Try selecting some other indicator for composite which can be previewed");
                        log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:query,code:query-data-empty");
                        return response;
                    }

                    //try { log.info("Query data: " + mapper.writeValueAsString(queryDataSet)); } catch (Exception exc) {}

                    //Validating the analytics method
                    try {

                        // If the data is successfully obtained, it is the same as basic indicatro, verify whether it is valid
                        String methodValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + previewRequest.getAnalyticsMethodId().get(indicatorName) + "/validateConfiguration", queryToMethodConfig.toString());
                        OpenLAPDataSetConfigValidationResult methodValid = mapper.readValue(methodValidJSON, OpenLAPDataSetConfigValidationResult.class);

                        if (!methodValid.isValid()) {
                            response.setSuccess(false);
                            response.setErrorMessage(methodValid.getValidationMessage());
                            log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-validate,code:unknown,msg:" + methodValid.getValidationMessage());
                            return response;
                        }

                    } catch (Exception exc) {
                        response.setSuccess(false);
                        response.setErrorMessage("An unknown error has occurred while validating the inputs to the analysis for indicator '" + indicatorName + "'. please contact the admins with the following error: " + exc.getMessage());
                        log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-validate,code:unknown,msg:" + exc.getMessage());
                        return response;
                    }

                    //Applying the analytics method
                    OpenLAPDataSet analyzedDataSet = null;
                    try {
                        // load local analysis Method
                        // 1. Get the file location of the predefined analysisMethod
                        AnalyticsMethodsClassPathLoader classPathLoader = analyticsMethodsService.getFolderNameFromResources();

                        AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(previewRequest.getAnalyticsMethodId().get(indicatorName), classPathLoader);
                        // Load the parameters related to the method. According to the incoming json, if there is no index corresponding to the current indcator in "MethodInputParams", it will be considered as not existing.
                        String rawMethodParams = previewRequest.getMethodInputParams().containsKey(indicatorName) ? previewRequest.getMethodInputParams().get(indicatorName) : "";

                        // jackson中将jsonObject对象映射为Map
                        Map<String, String> methodParams = rawMethodParams.isEmpty() ? new HashMap<>() : mapper.readValue(rawMethodParams, new TypeReference<HashMap<String, String>>() {
                        });
                        method.initialize(queryDataSet, queryToMethodConfig, methodParams);
                        analyzedDataSet = method.execute();
                    } catch (AnalyticsMethodInitializationException amexc) {
                        response.setSuccess(false);
                        response.setErrorMessage("An unknown error occurred while starting the analysis for the indicator '" + indicatorName + "'. please contact the admins with the following error: " + amexc.getMessage());
                        log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-initialize,code:unknown,msg:" + amexc.getMessage());
                        return response;
                    } catch (Exception exc) {
                        response.setSuccess(false);
                        response.setErrorMessage("An unknown error occurred while performing the analysis for the indicator '" + indicatorName + "'. please contact the admins with the following error: " + exc.getMessage());
                        log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                        return response;
                    }


                    if (analyzedDataSet == null) {
                        response.setSuccess(false);
                        response.setErrorMessage("No analyzed data was generated for the indicator '" + indicatorName + "'.");
                        log.error("[Preview-Composite-End][" + indicatorName + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:analysis,code:analysis-data-empty");
                        return response;
                    }

                    //try { log.info("Analyzed data: " + mapper.writeValueAsString(analyzedDataSet)); } catch (Exception exc) {}
                    List<OpenLAPColumnConfigData> columnConfigDatas = analyzedDataSet.getColumnsConfigurationData();
                    //Merging analyzed dataset
                    if (combinedAnalyzedDataSet == null) {
                        String json = gson.toJson(analyzedDataSet);
                        combinedAnalyzedDataSet = gson.fromJson(json, OpenLAPDataSet.class);
                        if (addIndicatorNameColumn)
                            if (!combinedAnalyzedDataSet.getColumns().containsKey("indicator_names"))
                                // Then initialize the key-value pair.
                                // String columnId = column.getConfigurationData().getId();  this.columns.put(columnId, column);
                                // The logic of addOpenLAPDataColumn is to pass in a parameter of OpenLAPDataColumn, which re-stores the configId and column data body.
                                combinedAnalyzedDataSet.addOpenLAPDataColumn(OpenLAPDataColumnFactory.createOpenLAPDataColumnOfType("indicator_names", OpenLAPColumnDataType.Text, true, "Indicator Names", "Names of the indicators combines together to form the composite."));
                    } else {
                        for (OpenLAPColumnConfigData columnConfigData : columnConfigDatas){
                            combinedAnalyzedDataSet.getColumns().get(columnConfigData.getId()).getData()
                                    .addAll(analyzedDataSet.getColumns().get(columnConfigData.getId()).getData());
                        }

                    }
                    // new
                    HashMap<Object, Object> objectObjectHashMap = new HashMap<>();

                    for (OpenLAPColumnConfigData columnConfigData : columnConfigDatas){
                        objectObjectHashMap.put(columnConfigData.getId(),analyzedDataSet.getColumns().get(columnConfigData.getId()).getData());
                    }

                    analyticsHashMapList.add(objectObjectHashMap);
                    if (addIndicatorNameColumn) {
                        int dataSize = analyzedDataSet.getColumns().get(columnId).getData().size();
                        for (int i = 0; i < dataSize; i++)
                            // Put the results obtained by each analyticsMethod into the result set.
                            combinedAnalyzedDataSet.getColumns().get("indicator_names").getData().add(indicatorName);
                    }
                }
                // for end

                for (HashMap<Object, Object> objectHashMap : analyticsHashMapList) {
                    Map<String,Integer> objectObjectTreeMap = new TreeMap<>();
                    ArrayList<Integer> itemCounts = (ArrayList<Integer>) objectHashMap.get("item_count");
                    ArrayList<String> itemNames = (ArrayList<String>) objectHashMap.get("item_name");
                    for (int i = 0; i < itemCounts.size(); i++) {
                        objectObjectTreeMap.put(itemNames.get(i), itemCounts.get(i));
                    }
                    analyticsTreeMaps.add(objectObjectTreeMap);
                }
                Set<String> allKeys = new TreeSet<>();
                for (Map<String, Integer> map : analyticsTreeMaps) {
                    allKeys.addAll(map.keySet());
                }
                int maxLength = allKeys.size();

                List<List<String>> values = new ArrayList<>(analyticsTreeMaps.size());

                for (int i = 0; i < analyticsTreeMaps.size(); i++) {
                    Map<String, Integer> map = analyticsTreeMaps.get(i);
                    List<String> list = new ArrayList<>(Collections.nCopies(maxLength, "0"));
                    for (Map.Entry<String, Integer> entry : map.entrySet()) {
                        String key = entry.getKey();
                        Integer value = entry.getValue();
                        int index = new ArrayList<>(allKeys).indexOf(key);
                        list.set(index, value.toString());
                    }
                    values.add(list);
                }
                // 将List中的value拼接成字符串，并输出
                for (int i = 0; i < values.size(); i++) {
                    String output = String.join(",", values.get(i));
                    System.out.println("map" + (i + 1) + ": " + output);
                }

                //try { log.info("Combined Analyzed data: " + mapper.writeValueAsString(combinedAnalyzedDataSet)); } catch (Exception exc) {}

                //visualizing the analyzed data
                String indicatorCode = "";
                combinedAnalyzedDataSet.getColumns().get("item_count").getData().clear();
                combinedAnalyzedDataSet.getColumns().get("item_count").getData().addAll(values);
                combinedAnalyzedDataSet.getColumns().get("item_name").getData().clear();
                combinedAnalyzedDataSet.getColumns().get("item_name").getData().addAll(allKeys);

                //Validating the visualization technique
                try {

                    ValidateVisualizationTypeConfigurationRequest visRequest = new ValidateVisualizationTypeConfigurationRequest();
                    visRequest.setConfigurationMapping(methodToVisConfig);

                    String visRequestJSON = mapper.writeValueAsString(visRequest);

                    ValidateVisualizationTypeConfigurationResponse visValid = Utils.performJSONPostRequest(baseUrl + "/frameworks/" + previewRequest.getVisualizationLibraryId() + "/methods/" + previewRequest.getVisualizationTypeId() + "/validateConfiguration", visRequestJSON, ValidateVisualizationTypeConfigurationResponse.class);

                    if (!visValid.isConfigurationValid()) {
                        response.setSuccess(false);
                        response.setErrorMessage(visValid.getValidationMessage());
                        log.error("[Preview-Composite-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-validate,code:unknown,msg:" + visValid.getValidationMessage());
                        return response;
                    }

                } catch (Exception exc) {
                    response.setSuccess(false);
                    response.setErrorMessage(exc.getMessage());
                    log.error("[Preview-Composite-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-validate,code:unknown,msg:" + exc.getMessage());
                    return response;
                }

                try {
                    GenerateVisualizationCodeRequest visualRequest = new GenerateVisualizationCodeRequest();
                    visualRequest.setLibraryId(previewRequest.getVisualizationLibraryId());
                    visualRequest.setTypeId(previewRequest.getVisualizationTypeId());
                    visualRequest.setDataSet(combinedAnalyzedDataSet);
                    visualRequest.setPortConfiguration(methodToVisConfig);
                    visualRequest.setParams(previewRequest.getAdditionalParams());

                    String visualRequestJSON = mapper.writeValueAsString(visualRequest);

                    GenerateVisualizationCodeResponse visualResponse = Utils.performJSONPostRequest(baseUrl + "/generateVisualizationCode", visualRequestJSON, GenerateVisualizationCodeResponse.class);

                    indicatorCode = visualResponse.getVisualizationCode();
                } catch (Exception exc) {
                    response.setSuccess(false);
                    response.setErrorMessage(exc.getMessage());
                    log.error("[Preview-Composite-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-execute,code:unknown,msg:" + exc.getMessage());
                    return response;
                }

                response.setSuccess(true);
                response.setErrorMessage("");
                response.setVisualizationCode(Utils.encodeURIComponent(indicatorCode));
            }
            log.info("[Preview-Composite-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime));
            return response;
        } catch (Exception exc) {
            response.setSuccess(false);
            response.setErrorMessage(exc.getMessage());
            log.error("[Preview-Composite-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:indicator-preview,code:unknown,msg:" + exc.getMessage());
            return response;
        }
    }

    public Object getMLAIIndicatorPreview(IndicatorPreviewRequest previewRequest, String baseUrl) {
        long indicatorExecutionStartTime = System.currentTimeMillis();
        long localPreviewCount = previewCount++;

        IndicatorPreviewResponse response = new IndicatorPreviewResponse();
        try {
            ObjectMapper mapper = new ObjectMapper();

            try {
                log.info("[Preview-MLAI-Start],user:" + previewRequest.getAdditionalParams().get("uid").toString() + ",count:" + localPreviewCount + ",param:" + mapper.writeValueAsString(previewRequest));
            } catch (Exception exc) {
            }

            //
            if (previewRequest.getIndicatorType().equals("multianalysis")) {

                Set<String> datasetIds = previewRequest.getQueries().keySet();
                OpenLAPPortConfigImp methodToVisConfig = previewRequest.getMethodToVisualizationConfig();

                Map<String, OpenLAPDataSet> analyzedDatasetMap = new HashMap<>();

                for (String datasetId : datasetIds) {
                    // Ignore the first item in queries because it does not have the item "query"
                    if (datasetId.equals("0")) // skipping 0 since it is the id for the 2nd level analytics method and it does not have a query
                        continue;

                    // Get the "query" of the current loop
                    QueryParameters curIndQuery = previewRequest.getQueries().get(datasetId);

                    // Get the "queryToMethodConfig" of the current loop
                    OpenLAPPortConfigImp queryToMethodConfig = previewRequest.getQueryToMethodConfig().get(datasetId);
                    /*
                    if(curIndQuery.contains("xxxridxxx")) {
                        if(!previewRequest.getAdditionalParams().containsKey("rid")){
                            response.setSuccess(false);
                            response.setErrorMessage("This indicator require a user code to generate personalized data which is not provided. Try again after refreshing the web page.");
                            log.error("[Preview-MLAI-End]["+datasetId+"],count:"+localPreviewCount+",time:" + (System.currentTimeMillis()-indicatorExecutionStartTime)+",step:rid,code:rid-missing");
                            return response;
                        }
                        else{
                            String userID = previewRequest.getAdditionalParams().get("rid").toString().toUpperCase();
                            curIndQuery = curIndQuery.replace("xxxridxxx", userID);
                        }
                    }
                    */
                    // OpenLAPDataSet queryDataSet = executeIndicatorQuery(curIndQuery, queryToMethodConfig, 0);
                    OpenLAPDataSet queryDataSet = statementServiceImp.getAllStatementsByCustomQuery(getId.apply(orgId), getId.apply(lrsId), curIndQuery);
                    if (queryDataSet == null) {
                        response.setSuccess(false);
                        response.setErrorMessage("No data found for the dataset '" + datasetId + "'. Try Changing the selections in its 'Dataset' and 'Filters' sections");
                        log.error("[Preview-MLAI-End][" + datasetId + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:query,code:query-data-empty");
                        return response;
                    }

                    //try { log.info("Query data: " + mapper.writeValueAsString(queryDataSet)); } catch (Exception exc) {}
                    //Validating the analytics method
                    try {
                        String methodValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + previewRequest.getAnalyticsMethodId().get(datasetId) + "/validateConfiguration", queryToMethodConfig.toString());
                        OpenLAPDataSetConfigValidationResult methodValid = mapper.readValue(methodValidJSON, OpenLAPDataSetConfigValidationResult.class);
                        if (!methodValid.isValid()) {
                            response.setSuccess(false);
                            response.setErrorMessage(methodValid.getValidationMessage());
                            log.error("[Preview-MLAI-End][" + datasetId + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-validate,code:unknown,msg:" + methodValid.getValidationMessage());
                            return response;
                        }
                    } catch (Exception exc) {
                        response.setSuccess(false);
                        response.setErrorMessage("An unknown error has occurred while validating the inputs to analysis for dataset '" + datasetId + "'. please contact the admins with the following error: " + exc.getMessage());
                        log.error("[Preview-MLAI-End][" + datasetId + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-validate,code:unknown,msg:" + exc.getMessage());
                        return response;
                    }

                    //Applying the analytics method
                    OpenLAPDataSet singleAnalyzedDataSet = null;
                    try {
                        AnalyticsMethodsClassPathLoader classPathLoader = analyticsMethodsService.getFolderNameFromResources();
                        //TODO 【FLAG】Note that here get(datasetId) traverses every set of data except "datasetId"=0, and when "datasetId"=0, it is the id of the second layer analysis.
                        AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(previewRequest.getAnalyticsMethodId().get(datasetId), classPathLoader);
                        String rawMethodParams = previewRequest.getMethodInputParams().containsKey(datasetId) ? previewRequest.getMethodInputParams().get(datasetId) : "";
                        Map<String, String> methodParams = rawMethodParams.isEmpty() ? new HashMap<>() : mapper.readValue(rawMethodParams, new TypeReference<HashMap<String, String>>() {
                        });

                        method.initialize(queryDataSet, queryToMethodConfig, methodParams);
                        // 拿到经过特定的AnalyticsMethod分析过的数据
                        singleAnalyzedDataSet = method.execute();
                    } catch (AnalyticsMethodInitializationException ame) {
                        response.setSuccess(false);
                        response.setErrorMessage("An unknown error occurred while starting the analysis for the dataset '" + datasetId + "'. please contact the admins with the following error: " + ame.getMessage());
                        log.error("[Preview-MLAI-End][" + datasetId + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-initialize,code:unknown,msg:" + ame.getMessage());
                        return response;
                    } catch (Exception exc) {
                        response.setSuccess(false);
                        response.setErrorMessage("An unknown error occurred while performing the analysis for he dataset '" + datasetId + "'. please contact the admins with the following error: " + exc.getMessage());
                        log.error("[Preview-MLAI-End][" + datasetId + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                        return response;
                    }

                    if (singleAnalyzedDataSet == null) {
                        response.setSuccess(false);
                        response.setErrorMessage("No analyzed data is generated from the dataset '" + datasetId + "'.");
                        log.error("[Preview-MLAI-End][" + datasetId + "],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:analysis,code:analysis-data-empty");
                        return response;
                    }

                    // Add the two sets of data
                    analyzedDatasetMap.put(datasetId, singleAnalyzedDataSet);
                }
                //mergning dataset
                /**
                 这里的dataSetMergeMapplingList就是这样的结构：
                 dataSetMergeMapplingList:[
                 OpenLAPDataSetMergeMapping:{
                 indRefKey1:"item_name",
                 indRefKey2:"attribute_1",
                 indRefField1:"item_name",
                 indRefField2:"attribute_2",
                 }
                 ]
                 */
                // Merge data from first layer analytics See no.4
                List<OpenLAPDataSetMergeMapping> mergeMappings = previewRequest.getDataSetMergeMappingList();
                OpenLAPDataSet mergedDataset = analyzedDatasetMap.get("1");
                boolean testFlag = false;
                ArrayList mlAttrList = new ArrayList();
                ArrayList indRefKeys = new ArrayList();
                OpenLAPPortConfigImp mlInputConfig = previewRequest.getQueryToMethodConfig().get("0");
                mlInputConfig.getMapping().forEach(e -> {
                    mlAttrList.add(e.getInputPort().getId());
                });
                OpenLAPDataSet res = new OpenLAPDataSet();

                for (OpenLAPDataSetMergeMapping mergeMapping : mergeMappings) {
                    indRefKeys.add(mergeMapping.getIndRefField1());
                    indRefKeys.add(mergeMapping.getIndRefField2());

                }

                for (int i = 0; i < analyzedDatasetMap.keySet().size(); i++) {
                    Object key = Arrays.asList(analyzedDatasetMap.keySet().toArray()).get(i);
                    OpenLAPDataSet keyObj = analyzedDatasetMap.get(key);
                    OpenLAPColumnConfigData openLAPColumnConfigData = keyObj.getColumnsConfigurationData().get(i);
                    OpenLAPDataColumn openLAPDataColumn = new OpenLAPDataColumn((String) mlAttrList.get(i), openLAPColumnConfigData.getType(), openLAPColumnConfigData.isRequired(), openLAPColumnConfigData.getTitle(), openLAPColumnConfigData.getDescription());
                    openLAPDataColumn.setData((keyObj.getColumns().get(indRefKeys.get(i)).getData()));
                    res.addOpenLAPDataColumn(openLAPDataColumn);
                }
                mergedDataset = res;


                // 【TODO】暂时先返回json
//                if (mergedDataset != null) {
//                    return mergedDataset;
//                }
                String mergeStatus = "";

                // 以下是合并
//                try {
//                    while (mergeMappings.size() > 0) {
//                        OpenLAPDataSet firstDataset = null;
//                        OpenLAPDataSet secondDataset = null;
//
//                        for (OpenLAPDataSetMergeMapping mergeMapping : mergeMappings) {
//                            String key1 = mergeMapping.getIndRefKey1();
//                            String key2 = mergeMapping.getIndRefKey2();
//
//                            int dashCountKey1 = StringUtils.countMatches(key1, "-"); //Merged keys will always be in key1
//                            //int dashCountKey2 = StringUtils.countMatches(key2, "-");
//
//                            if (dashCountKey1 == 0) {
//                                // 分别取出上一步分析过的数据。
//                                firstDataset = analyzedDatasetMap.get(key1);
//                                secondDataset = analyzedDatasetMap.get(key2);
//                            } else {
//                                if (!mergeStatus.isEmpty() && key1.equals(mergeStatus)) {
//                                    firstDataset = mergedDataset;
//                                    secondDataset = analyzedDatasetMap.get(key2);
//                                    key1 = "(" + key1 + ")";
//                                } else
//                                    continue;
//                            }
//                            // 将两组数据从Map中拆出来，并将相关的属性再组合成特定的OpenLAPDataSet 格式。
//                            // TODO 【FLAG】 目前卡在这里，需要分析dataSetMergeMappingList 组成成分与mergeOpenLAPDataSets() 处理逻辑。
//                            OpenLAPDataSet processedDataset = mergeOpenLAPDataSets(firstDataset, secondDataset, mergeMapping);
//                            if (processedDataset != null) {
//                                mergedDataset = processedDataset;
//                                mergeStatus = key1 + "-" + key2;
//                                mergeMappings.remove(mergeMapping);
//                            }
//                            break;
//                        }
//                    }
//                } catch (Exception exc) {
//                    response.setSuccess(false);
//                    response.setErrorMessage("An unknown error occurred while mergning the dataset. please contact the admins with the following error: " + exc.getMessage());
//                    log.error("[Preview-MLAI-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:dataset-merge,code:unknown,msg:" + exc.getMessage());
//                    return response;
//                }

                //try { log.info("Merged Analyzed data: " + mapper.writeValueAsString(mergedDataset)); } catch (Exception exc) {}


                // 这里是经过上一步特殊处理过后的Set
                OpenLAPDataSet analyzedDataSet = null;

                //Applying the final analysis whose configuration is stored always with id "0"
                OpenLAPPortConfigImp finalQueryToMethodConfig = previewRequest.getQueryToMethodConfig().get("0");
                try {
                    AnalyticsMethodsClassPathLoader classPathLoader = analyticsMethodsService.getFolderNameFromResources();
                    // TODO 【FLAG】这里是get("0") 即上面提到的，第二层分析方法的ID。
                    AnalyticsMethod method = analyticsMethodsService.loadAnalyticsMethodInstance(previewRequest.getAnalyticsMethodId().get("0"), classPathLoader);
                    String rawMethodParams = previewRequest.getMethodInputParams().containsKey("0") ? previewRequest.getMethodInputParams().get("0") : "";
                    Map<String, String> methodParams = rawMethodParams.isEmpty() ? new HashMap<>() : mapper.readValue(rawMethodParams, new TypeReference<HashMap<String, String>>() {
                    });

                    // TODO 【FLAG】这里的参考 AnalyticsMethod 中的initialize函数。
                    method.initialize(mergedDataset, finalQueryToMethodConfig, methodParams);
                    analyzedDataSet = method.execute();
                } catch (AnalyticsMethodInitializationException amexc) {
                    response.setSuccess(false);
                    response.setErrorMessage("An unknown error occurred while starting the final analysis. please contact the admins with the following error: " + amexc.getMessage());
                    log.error("[Preview-MLAI-End][final],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-initialize,code:unknown,msg:" + amexc.getMessage());
                    return response;
                } catch (Exception exc) {
                    response.setSuccess(false);
                    response.setErrorMessage("An unknown error occurred while performing the final analysis. please contact the admins with the following error: " + exc.getMessage());
                    log.error("[Preview-MLAI-End][final],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:method-execute,code:unknown,msg:" + exc.getMessage());
                    return response;
                }

//                if (analyzedDataSet == null) {
//                    response.setSuccess(false);
//                    response.setErrorMessage("No analyzed data is generated from the final analysis.");
//                    log.error("[Preview-MLAI-End][final],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:analysis,code:analysis-data-empty");
//                    return response;
//                }

                //try { log.info("Analyzed data: " + mapper.writeValueAsString(analyzedDataSet)); } catch (Exception exc) { }
                //visualizing the analyzed data
                String indicatorCode = "";

                //Validating the visualization technique
                try {
                    ValidateVisualizationTypeConfigurationRequest visRequest = new ValidateVisualizationTypeConfigurationRequest();
                    visRequest.setConfigurationMapping(methodToVisConfig);
                    String visRequestJSON = mapper.writeValueAsString(visRequest);
                    ValidateVisualizationTypeConfigurationResponse visValid = Utils.performJSONPostRequest(baseUrl + "/frameworks/" + previewRequest.getVisualizationLibraryId() + "/methods/" + previewRequest.getVisualizationTypeId() + "/validateConfiguration", visRequestJSON, ValidateVisualizationTypeConfigurationResponse.class);

                    if (!visValid.isConfigurationValid()) {
                        response.setSuccess(false);
                        response.setErrorMessage(visValid.getValidationMessage());
                        log.error("[Preview-MLAI-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-validate,code:unknown,msg:" + visValid.getValidationMessage());
                        return response;
                    }

                } catch (Exception exc) {
                    response.setSuccess(false);
                    response.setErrorMessage(exc.getMessage());
                    log.error("[Preview-MLAI-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-validate,code:unknown,msg:" + exc.getMessage());
                    return response;
                }
//                if (testFlag) {
                ArrayList cluster_name = analyzedDataSet.getColumns().get("cluster_name").getData();
                ArrayList attribute_1 = analyzedDataSet.getColumns().get("attribute_1").getData();
                ArrayList attribute_2 = analyzedDataSet.getColumns().get("attribute_2").getData();

                HashMap<Object, ArrayList> objectObjectHashMap = new HashMap<>();
                ArrayList clusterSet = new ArrayList<>();
                for (int i = 0; i < cluster_name.size(); i++) {
                    String curItem = String.valueOf(cluster_name.get(i)).replace(" ", "");
                    String curItemWithX = String.format("%s_x", curItem);

                    if (objectObjectHashMap.get(curItem) == null) {
                        ArrayList<Object> objectsx = new ArrayList<>();
                        ArrayList<Object> objectsy = new ArrayList<>();
                        objectsx.add(attribute_1.get(i));
                        objectsy.add(attribute_2.get(i));
                        objectObjectHashMap.put(curItem, objectsx);
                        objectObjectHashMap.put(curItemWithX, objectsy);
                    } else {
                        objectObjectHashMap.get(curItem).add(attribute_1.get(i));
                        objectObjectHashMap.get(curItemWithX).add(attribute_2.get(i));
                    }
                }
                ArrayList A1L = new ArrayList();
                ArrayList A2L = new ArrayList();
                objectObjectHashMap.entrySet().forEach(e -> {
                    if (!String.valueOf(e.getKey()).contains("_x")) {
                        clusterSet.add(e.getKey());
                        A1L.add(e.getValue().stream().map(String::valueOf).collect(Collectors.joining(",")));
                        A2L.add(objectObjectHashMap.get(String.format("%s_x", e.getKey())).stream().map(String::valueOf).collect(Collectors.joining(",")));
                    }
                });
                analyzedDataSet.getColumns().get("cluster_name").setData(clusterSet);
                analyzedDataSet.getColumns().get("attribute_1").setData(A1L);
                analyzedDataSet.getColumns().get("attribute_2").setData(A2L);
//                }

                try {
                    GenerateVisualizationCodeRequest visualRequest = new GenerateVisualizationCodeRequest();
                    visualRequest.setLibraryId(previewRequest.getVisualizationLibraryId());
                    visualRequest.setTypeId(previewRequest.getVisualizationTypeId());
                    // 【TODO】测试用
//                    visualRequest.setDataSet(mergedDataset);
                    visualRequest.setDataSet(analyzedDataSet);
                    visualRequest.setPortConfiguration(methodToVisConfig);
                    visualRequest.setParams(previewRequest.getAdditionalParams());

                    String visualRequestJSON = mapper.writeValueAsString(visualRequest);

                    GenerateVisualizationCodeResponse visualResponse = Utils.performJSONPostRequest(baseUrl + "/generateVisualizationCode", visualRequestJSON, GenerateVisualizationCodeResponse.class);
                    indicatorCode = visualResponse.getVisualizationCode();
                } catch (Exception exc) {
                    response.setSuccess(false);
                    response.setErrorMessage(exc.getMessage());
                    log.error("[Preview-MLAI-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:vis-execute,code:unknown,msg:" + exc.getMessage());
                    return response;
                }

                response.setSuccess(true);
                response.setErrorMessage("");
                response.setVisualizationCode(Utils.encodeURIComponent(indicatorCode));
            }
            log.info("[Preview-MLAI-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime));
            return response;
        } catch (Exception exc) {
            response.setSuccess(false);
            response.setErrorMessage(exc.getMessage());
            log.error("[Preview-MLAI-End],count:" + localPreviewCount + ",time:" + (System.currentTimeMillis() - indicatorExecutionStartTime) + ",step:indicator-preview,code:unknown,msg:" + exc.getMessage());
            return response;
        }
    }

    //endregion
    public OpenLAPDataSet mergeOpenLAPDataSets(OpenLAPDataSet firstDataset, OpenLAPDataSet secondDataSet, OpenLAPDataSetMergeMapping mapping) {

        int firstDataSize, secondDataSize;

        int intDefaultValue = -1;
        String strDefaultValue = "-";
        char charDefaultValue = '-';

        List<OpenLAPDataColumn> firstColumns = firstDataset.getColumnsAsList(false);
        HashMap<String, ArrayList> firstData = new HashMap<>();
        firstDataSize = firstColumns.get(0).getData().size();

        for (OpenLAPDataColumn column : firstColumns)
            firstData.put(column.getConfigurationData().getId(), column.getData());

        List<OpenLAPDataColumn> firstColumnsBase = firstDataset.getColumnsAsList(false);

        List<OpenLAPDataColumn> secondColumns = secondDataSet.getColumnsAsList(false);
        HashMap<String, ArrayList> secondData = new HashMap<>();
        secondDataSize = secondColumns.get(0).getData().size();

        for (OpenLAPDataColumn column : secondColumns) {
            secondData.put(column.getConfigurationData().getId(), column.getData());

            //Adding the second dataset columns with default values to first dataset
            if (!mapping.getIndRefField2().equals(column.getConfigurationData().getId())) {

                OpenLAPDataColumn newColumn;
                ArrayList newData;
                switch (column.getConfigurationData().getType()) {
                    case Text:
                        newColumn = new OpenLAPDataColumn<String>(column.getConfigurationData().getId(), OpenLAPColumnDataType.Text, column.getConfigurationData().isRequired(), column.getConfigurationData().getTitle(), column.getConfigurationData().getDescription());
                        newData = new ArrayList<String>(Collections.nCopies(firstDataSize, strDefaultValue));
                        break;
                    case TrueFalse:
                        newColumn = new OpenLAPDataColumn<Boolean>(column.getConfigurationData().getId(), OpenLAPColumnDataType.TrueFalse, column.getConfigurationData().isRequired(), column.getConfigurationData().getTitle(), column.getConfigurationData().getDescription());
                        newData = new ArrayList<Boolean>(Collections.nCopies(firstDataSize, false));
                        break;
                    case Numeric:
                        newColumn = new OpenLAPDataColumn<Float>(column.getConfigurationData().getId(), OpenLAPColumnDataType.Numeric, column.getConfigurationData().isRequired(), column.getConfigurationData().getTitle(), column.getConfigurationData().getDescription());
                        newData = new ArrayList<Float>(Collections.nCopies(firstDataSize, (float) intDefaultValue));
                        break;
                    default:
                        newColumn = new OpenLAPDataColumn<String>(column.getConfigurationData().getId(), OpenLAPColumnDataType.Text, column.getConfigurationData().isRequired(), column.getConfigurationData().getTitle(), column.getConfigurationData().getDescription());
                        newData = new ArrayList<String>(Collections.nCopies(firstDataSize, strDefaultValue));
                        break;
                }
                //newColumn.setData(newData);

                firstData.put(newColumn.getConfigurationData().getId(), newData);
                firstColumns.add(newColumn);
            }
        }


        //merging data from second dataset into first dataset

        for (int i = 0; i < secondDataSize; i++) {
            Object commonFieldValue = secondData.get(mapping.getIndRefField2()).get(i);

            boolean valFound = false;
            for (int j = 0; j < firstDataSize; j++) {
                if (firstData.get(mapping.getIndRefField1()).get(j).equals(commonFieldValue)) {

                    for (String key : secondData.keySet()) {
                        if (!key.equals(mapping.getIndRefField2()))
                            firstData.get(key).set(j, secondData.get(key).get(i));
                    }

                    valFound = true;
                    break;
                }
            }

            if (!valFound) {
                for (String key : secondData.keySet()) {
                    if (!key.equals(mapping.getIndRefField2()))
                        firstData.get(key).add(secondData.get(key).get(i));
                }

                //Adding the default values to the first dataset data array
                for (OpenLAPDataColumn column : firstColumnsBase) {
                    if (column.getConfigurationData().getId().equals(mapping.getIndRefField1()))
                        firstData.get(column.getConfigurationData().getId()).add(commonFieldValue);
                    else {
                        switch (column.getConfigurationData().getType()) {
                            case Text:
                                firstData.get(column.getConfigurationData().getId()).add(strDefaultValue);
                                break;
                            case TrueFalse:
                                firstData.get(column.getConfigurationData().getId()).add(false);
                                break;
                            case Numeric:
                                firstData.get(column.getConfigurationData().getId()).add((float) intDefaultValue);
                                break;
                            default:
                                firstData.get(column.getConfigurationData().getId()).add(strDefaultValue);
                                break;
                        }
                    }
                }
            }
        }

        OpenLAPDataSet mergedDataset = new OpenLAPDataSet();
        //Generating merged dataset using the columns and data
        for (OpenLAPDataColumn column : firstColumns) {
            column.setData(firstData.get(column.getConfigurationData().getId()));
            try {
                mergedDataset.addOpenLAPDataColumn(column);
            } catch (OpenLAPDataColumnException e) {
                e.printStackTrace();
            }
        }

        return mergedDataset;
    }

    public List<Indicator> getAllIndicators() {
        String query = "From Indicator";
        List<Indicator> result = em.createQuery(query).getResultList();
        return result;
    }

    public void deleteIndicator(String indicatorId) {
        Indicator result = em.find(Indicator.class, indicatorId);
        if (result == null || indicatorId == null) {
            throw new ItemNotFoundException("Indicator with id = {" + indicatorId + "} not found.", "2");
        } else {
            em.getTransaction().begin();
            em.remove(result);
            em.getTransaction().commit();
            em.close();
        }
    }

    public Triad getTriadById(String triadId) throws ItemNotFoundException {
        String hql = "FROM Triad WHERE id = :triadId";
        Query query = em.createQuery(hql, Triad.class);
        query.setParameter("triadId", triadId);

        List<Triad> result = query.getResultList();

        if (result.size() == 0)
            return null;
        else
            return result.get(0);
    }

    public TriadCache fetchTriadCacheById(String triadId) throws ItemNotFoundException {
        String hql = "FROM TriadCache WHERE triadId = :triadId";
        Query query = em.createQuery(hql, TriadCache.class);
        query.setParameter("triadId", triadId);

        List<TriadCache> result = query.getResultList();
        if (result.size() == 0)
            return null;
        else
            return result.get(0);
    }


    public TriadCache getCacheByTriadId(String triadId, String userHash) throws ItemNotFoundException {
//		String query = "FROM TriadCache where id =: triadId";
        String hql = "FROM TriadCache WHERE id = :triadId";
        Query query = em.createQuery(hql, TriadCache.class);
        query.setParameter("triadId", triadId);

        List<TriadCache> result = query.getResultList();
        if (result == null) {
            return null;
        } else if (result.size() == 1) {
            return result.get(0);
        } else {
            return null;
        }

//		List<TriadCache> result = em.createQuery(query, TriadCache.class).getResultList();

//		if (result == null) {
//			return null;
//		} else {
//			if (result.size() == 1) {
//				if (result.get(0).getUserHash() == null || result.get(0).getUserHash().equals("") || result.get(0).getUserHash().equals(userHash))
//					return result.get(0);
//				else
//					return null;
//			} else {
//				for (TriadCache triadCache : result)
//					if (triadCache.getUserHash().equals(userHash))
//						return triadCache;
//
//				return null;
//			}
//		}
    }

    public IndicatorResponse getTriadById(String triadId, HttpServletRequest request) {
        IndicatorResponse indicatorResponse = new IndicatorResponse();
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();

        Triad triad;

        try {
            String triadJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/" + triadId);
            triad = mapper.readValue(triadJSON, Triad.class);
        } catch (Exception exc) {
            throw new ItemNotFoundException("Indicator with triad id '" + triadId + "' not found.", "1");
        }


        if (triad == null)
            throw new ItemNotFoundException("Indicator with triad id '" + triadId + "' not found.", "1");

        Indicator indicator = getIndicatorById(triad.getIndicatorReference().getIndicators().get("0").getId());

        indicatorResponse.setId(triad.getId());
        indicatorResponse.setQuery(indicator.getQueries());
        indicatorResponse.setIndicatorReference(triad.getIndicatorReference());
        indicatorResponse.setAnalyticsMethodReference(triad.getAnalyticsMethodReference());
        indicatorResponse.setVisualizationReference(triad.getVisualizationReference());

        indicatorResponse.setQueryToMethodConfig(new HashMap<>());
        indicatorResponse.getQueryToMethodConfig().put("0", triad.getIndicatorToAnalyticsMethodMapping().getPortConfigs().get("0"));
        indicatorResponse.setMethodToVisualizationConfig(triad.getAnalyticsMethodToVisualizationMapping());
        indicatorResponse.setName(indicator.getName());
        indicatorResponse.setParameters(triad.getParameters());
        //indicatorResponse.setComposite(indicator.isComposite());
        indicatorResponse.setIndicatorType(triad.getIndicatorReference().getIndicatorType());
        indicatorResponse.setCreatedBy(triad.getCreatedBy());

        return indicatorResponse;
    }

    private boolean setQuestionTriadMapping(String questionId, String triadId) {
        boolean isSuccess = true;

//		String queryString = "INSERT INTO question_triad (question_id, triad_id)" +
//				" VALUES (" + questionId + "," + triadId + ")";

        QuestionTriad questionTriad = new QuestionTriad(questionId, triadId);
        try {
            em.getTransaction().begin();
            em.persist(questionTriad);
            em.flush();
            em.getTransaction().commit();
//			insertSQLQueryRaw(queryString);
        } catch (Exception exc) {
            isSuccess = false;
        }

        return isSuccess;
    }

    public void uploadJarFile(String url, MultipartFile jarFile){
        try{
            Utils.performPostRequestBySendingJarFile(url, jarFile);
        }catch (AnalyticsMethodsBadRequestException e){
            throw new AnalyticsMethodsBadRequestException(e.getMessage());
        }
    }

    public void deleteAnalyticsOrVisualizationMethod(String urlWithId){
        try{
            Utils.performDeleteRequest(urlWithId);
        }catch (AnalyticsMethodsBadRequestException e){
            throw new AnalyticsMethodsBadRequestException(e.getMessage());
        }
    }

    public List<VisualizationType> getAllVisualizationTypesForCertainLibrary(String url) {
        ObjectMapper mapper = new ObjectMapper();
        List<VisualizationType> allTypes;
        try {
            String methodsJSON = Utils.performGetRequest(url);
            allTypes = mapper.readValue(methodsJSON, mapper.getTypeFactory().constructCollectionType(List.class, VisualizationType.class));
            return allTypes;
        } catch (Exception e) {
            throw new AnalyticsMethodsBadRequestException("Failed to fetch visualization types");
        }
    }

    public List<AnalyticsMethods> getAllAnalyticsMethods(HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());

        ObjectMapper mapper = new ObjectMapper();

        List<AnalyticsMethods> allMethods;

        try {
            String methodsJSON = Utils.performGetRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods");
            allMethods = mapper.readValue(methodsJSON, mapper.getTypeFactory().constructCollectionType(List.class, AnalyticsMethods.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return allMethods;
    }

    public List<VisualizationLibrary> getAllVisualizations(HttpServletRequest request) {

        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper();

        List<VisualizationLibrary> allVis;

        try {
            String visualizationsJSON = Utils.performGetRequest(baseUrl + "/frameworks/list");
            allVis = mapper.readValue(visualizationsJSON, mapper.getTypeFactory().constructCollectionType(List.class, VisualizationLibrary.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return allVis;
    }

    public List<VisualizationLibrary> getVisualizationsMethods(String libraryid, HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);

        List<VisualizationLibrary> visMethods;

        try {
            String visualizationsJSON = Utils.performGetRequest(baseUrl + "/frameworks/" + libraryid);
            visMethods = mapper.readValue(visualizationsJSON, mapper.getTypeFactory().constructCollectionType(List.class, VisualizationLibrary.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return visMethods;
    }

    public List<AnalyticsGoal> getAllGoals(HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());

        ObjectMapper mapper = new ObjectMapper();

        List<AnalyticsGoal> allGoals;

        try {
            String goalsJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModule/AnalyticsGoals/");
            allGoals = mapper.readValue(goalsJSON, mapper.getTypeFactory().constructCollectionType(List.class, AnalyticsGoal.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return allGoals;
    }

    public List<AnalyticsGoal> getActiveGoals(String userid, HttpServletRequest request) {
        if (userid != null)
            log.info("[Editor-New],user:" + userid);
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());

        ObjectMapper mapper = new ObjectMapper();

        List<AnalyticsGoal> allGoals;

        try {
            String goalsJSON = Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/ActiveAnalyticsGoals/");
            allGoals = mapper.readValue(goalsJSON, mapper.getTypeFactory().constructCollectionType(List.class, AnalyticsGoal.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return allGoals;
    }

    public AnalyticsGoal saveGoal(String goalName, String goalDesc, String goalAuthor, HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());

        ObjectMapper mapper = new ObjectMapper();

        try {
            AnalyticsGoal newGoal = new AnalyticsGoal();
            newGoal.setName(goalName);
            newGoal.setDescription(goalDesc);
            newGoal.setAuthor(goalAuthor);

            String saveGoalRequestJSON = mapper.writeValueAsString(newGoal);

            AnalyticsGoal savedGoal = Utils.performJSONPostRequest(baseUrl + "/analyticsmodule/AnalyticsModules/AnalyticsGoals/", saveGoalRequestJSON, AnalyticsGoal.class);

            return savedGoal;
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }
    }

    public AnalyticsGoal setGoalStatus(String goalId, boolean isActive, HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());

        ObjectMapper mapper = new ObjectMapper();

        String setStatus;

        if (isActive)
            setStatus = "activate";
        else
            setStatus = "deactivate";

        try {

            String saveGoalResponseJSON = Utils.performPutRequest(baseUrl + "/analyticsmodule/AnalyticsModules/AnalyticsGoals/" + goalId + "/" + setStatus, null);
            AnalyticsGoal returnedGoal = mapper.readValue(saveGoalResponseJSON, AnalyticsGoal.class);

            return returnedGoal;
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }
    }

    public QuestionSaveResponse saveQuestionAndIndicators(QuestionSaveRequest saveRequest, String baseUrl) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<HashMap<String, String>> hashMapType = new TypeReference<HashMap<String, String>>() {
        };
        QuestionSaveResponse questionSaveResponse = new QuestionSaveResponse();
        List<IndicatorSaveResponse> indicatorResponses = new ArrayList<IndicatorSaveResponse>();

        Question question = new Question(
                saveRequest.getQuestion(),
                saveRequest.getIndicators().size(),
                saveRequest.getCreatedBy()
        );

        Question savedQuestion = saveQuestion(question);

        for (IndicatorSaveRequest indicatorRequest : saveRequest.getIndicators()) {

            IndicatorSaveResponse indicatorResponse = new IndicatorSaveResponse();
            indicatorResponse.setIndicatorClientID(indicatorRequest.getIndicatorClientID());

            Triad triadById = getTriadById(indicatorRequest.getIndicatorClientID());

            // If triad does not exist, generate an indicator entity, triad entity and visualization
            if (triadById == null) {
                try {
                    //Saving the indicator query
                    Indicator ind = new Indicator();
                    ind.setName(indicatorRequest.getName());
                    ind.setType(indicatorRequest.getIndicatorType());
                    Set<Map.Entry<String, QueryParameters>> querySet = indicatorRequest.getQueries().entrySet();
                    for (Map.Entry<String, QueryParameters> indQuery : querySet)
                        ind.getQueries().put(indQuery.getKey(), indQuery.getValue());
                    Indicator savedInd = saveIndicator(ind);

                    IndicatorReference indicatorReference = new IndicatorReference();
                    indicatorReference.setIndicatorType(indicatorRequest.getIndicatorType());

                    indicatorReference.getIndicators().put("0", new IndicatorEntry(savedInd.getId(), savedInd.getName()));

                    indicatorReference.setDataSetMergeMappingList(indicatorRequest.getDataSetMergeMappingList());

                    AnalyticsMethodReference methodReference = new AnalyticsMethodReference();
                    for (Map.Entry<String, String> methodId : indicatorRequest.getAnalyticsMethodId().entrySet()) {
                        String methodParamRaw = indicatorRequest.getMethodInputParams().get(methodId.getKey());
                        HashMap<String, String> methodParam;
                        if (methodParamRaw == null || methodParamRaw.isEmpty())
                            methodParam = new HashMap<>();
                        else
                            methodParam = mapper.readValue(methodParamRaw, hashMapType);
                        methodReference.getAnalyticsMethods().put(methodId.getKey(), new AnalyticsMethodParam(methodId.getValue(), methodParam));
                    }

                    OpenLAPPortConfigReference queryToMethodReference = new OpenLAPPortConfigReference();
                    for (Map.Entry<String, OpenLAPPortConfigImp> methodConfig : indicatorRequest.getQueryToMethodConfig().entrySet()) {
                        //Validating the data to method port configuration
                        String queryToMethodConfigJSON = methodConfig.getValue().toString();
//        WRONG Statement validation!
//        String queryToMethodConfigValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethods/" + indicatorRequest.getAnalyticsMethodId().get(methodConfig.getKey()) + "/validateConfiguration", queryToMethodConfigJSON);
                        String queryToMethodConfigValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + indicatorRequest.getAnalyticsMethodId().get("0") + "/validateConfiguration", queryToMethodConfigJSON);
                        OpenLAPDataSetConfigValidationResult queryToMethodConfigValid = mapper.readValue(queryToMethodConfigValidJSON, OpenLAPDataSetConfigValidationResult.class);
                        if (!queryToMethodConfigValid.isValid()) {
                            indicatorResponse.setIndicatorSaved(false);
                            indicatorResponse.setErrorMessage("Query to Method Port-Configuration is not valid: " + queryToMethodConfigValid.getValidationMessage());
                            indicatorResponses.add(indicatorResponse);
                            continue;
                        }
                        queryToMethodReference.getPortConfigs().put(methodConfig.getKey(), methodConfig.getValue());
                    }

                    String visFrameworkJSON = Utils.performGetRequest(baseUrl + "/frameworks/" + indicatorRequest.getVisualizationLibraryId());
                    VisualizationLibrary frameworkResponse = mapper.readValue(visFrameworkJSON, VisualizationLibrary.class);
                    String visMethodJSON = Utils.performGetRequest(baseUrl + "/frameworks/" + indicatorRequest.getVisualizationLibraryId() + "/methods/" + indicatorRequest.getVisualizationTypeId());
                    VisualizationType methodResponse = mapper.readValue(visMethodJSON, VisualizationType.class);
                    VisualizerReference visualizerReference = new VisualizerReference(frameworkResponse.getId(),
                            methodResponse.getId(),
                            indicatorRequest.getVisualizationInputParams());

                    //Validating the method to visualization port configuration
                    ValidateVisualizationTypeConfigurationRequest methodToVisConfigRequest = new ValidateVisualizationTypeConfigurationRequest();
                    methodToVisConfigRequest.setConfigurationMapping(indicatorRequest.getMethodToVisualizationConfig());
                    String visRequestJSON = mapper.writeValueAsString(methodToVisConfigRequest);
                    ValidateVisualizationTypeConfigurationResponse methodToVisConfigValid = Utils.performJSONPostRequest(baseUrl + "/frameworks/" + indicatorRequest.getVisualizationLibraryId() + "/methods/" + indicatorRequest.getVisualizationTypeId() + "/validateConfiguration", visRequestJSON, ValidateVisualizationTypeConfigurationResponse.class);

                    if (!methodToVisConfigValid.isConfigurationValid()) {
                        indicatorResponse.setIndicatorSaved(false);
                        indicatorResponse.setErrorMessage("Method to Visualization Port-Configuration is not valid: " + methodToVisConfigValid.getValidationMessage());
                        indicatorResponses.add(indicatorResponse);
                        continue;
                    }

                    //Saving the triad
                    Triad triad = new Triad(
                            saveRequest.getGoal(),
                            indicatorReference,
                            methodReference,
                            visualizerReference,
                            queryToMethodReference,
                            indicatorRequest.getMethodToVisualizationConfig()
                    );
                    triad.setCreatedBy(indicatorRequest.getCreatedBy());
                    triad.setParameters(indicatorRequest.getParameters());
                    String triadJSON = mapper.writeValueAsString(triad);

                    Triad savedTriad = Utils.performJSONPostRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/", triadJSON, Triad.class);

                    setQuestionTriadMapping(savedQuestion.getId(), savedTriad.getId());

                    String iFrameCode = "<iframe src='" + indicatorExecutionURL + "?triadID=" + savedTriad.getId() +
                            "' frameborder='0' height='500px' width='500px' />";

                    indicatorResponse.setIndicatorSaved(true);
                    indicatorResponse.setIndicatorClientID(indicatorRequest.getIndicatorClientID());
                    indicatorResponse.setIndicatorRequestCode(iFrameCode);
                    indicatorResponses.add(indicatorResponse);
                } catch (Exception exc) {

                    indicatorResponse.setIndicatorSaved(false);
                    indicatorResponse.setErrorMessage(exc.getMessage());
                }
            } else {
                try {
                    setQuestionTriadMapping(savedQuestion.getId(), triadById.getId());

                    String iFrameCode = "<iframe src='" + indicatorExecutionURL + "?triadID=" + triadById.getId() +
                            "' frameborder='0' height='500px' width='500px' />";

                    indicatorResponse.setIndicatorSaved(true);
                    indicatorResponse.setIndicatorClientID(indicatorRequest.getIndicatorClientID());
                    indicatorResponse.setIndicatorRequestCode(iFrameCode);
//				indicatorResponse.setIndicatorRequestCode(getIndicatorRequestCode(savedTriad));

                    indicatorResponses.add(indicatorResponse);
                } catch (Exception exc) {
                    indicatorResponse.setIndicatorSaved(false);
                    indicatorResponse.setErrorMessage(exc.getMessage());
                }
            }
        }

        questionSaveResponse.setIndicatorSaveResponses(indicatorResponses);
//		questionSaveResponse.setQuestionRequestCode(getQuestionRequestCode(triads));
        questionSaveResponse.setQuestionSaved(true);

        return questionSaveResponse;
    }

    // 【TODO】保存composite
    @Transactional
    public IndicatorSaveResponse saveCompositeIndicator(IndicatorSaveRequest saveRequest, String baseUrl) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<HashMap<String, String>> hashMapType = new TypeReference<HashMap<String, String>>() {
        };
        QuestionSaveResponse questionSaveResponse = new QuestionSaveResponse();
        IndicatorSaveRequest indicatorRequest = saveRequest;

        IndicatorSaveResponse indicatorResponse = new IndicatorSaveResponse();
        indicatorResponse.setIndicatorClientID(indicatorRequest.getIndicatorClientID());

        Triad triadById = getTriadById(indicatorRequest.getIndicatorClientID());

        // If triad does not exist, generate an indicator entity, triad entity and visualization
        if (triadById == null) {
            try {
                //Saving the indicator query
                Indicator ind = new Indicator();
                ind.setName(indicatorRequest.getName());
                ind.setType(indicatorRequest.getIndicatorType());
                Set<Map.Entry<String, QueryParameters>> querySet = indicatorRequest.getQueries().entrySet();
                for (Map.Entry<String, QueryParameters> indQuery : querySet)
                    ind.getQueries().put(indQuery.getKey(), indQuery.getValue());
                Indicator savedInd = null;
                try {
                    savedInd = saveIndicator(ind);
                } catch (PersistenceException pe) {
                    pe.printStackTrace();
                }

                IndicatorReference indicatorReference = new IndicatorReference();
                indicatorReference.setIndicatorType(indicatorRequest.getIndicatorType());

                indicatorReference.getIndicators().put("0", new IndicatorEntry(savedInd.getId(), savedInd.getName()));

                indicatorReference.setDataSetMergeMappingList(indicatorRequest.getDataSetMergeMappingList());

                AnalyticsMethodReference methodReference = new AnalyticsMethodReference();
                for (Map.Entry<String, String> methodId : indicatorRequest.getAnalyticsMethodId().entrySet()) {
                    String methodParamRaw = indicatorRequest.getMethodInputParams().get(methodId.getKey());
                    HashMap<String, String> methodParam;
                    if (methodParamRaw == null || methodParamRaw.isEmpty())
                        methodParam = new HashMap<>();
                    else
                        methodParam = mapper.readValue(methodParamRaw, hashMapType);
                    methodReference.getAnalyticsMethods().put(methodId.getKey(), new AnalyticsMethodParam(methodId.getValue(), methodParam));
                }

                OpenLAPPortConfigReference queryToMethodReference = new OpenLAPPortConfigReference();
                for (Map.Entry<String, OpenLAPPortConfigImp> methodConfig : indicatorRequest.getQueryToMethodConfig().entrySet()) {
                    ArrayList<String> strings = new ArrayList<>(indicatorRequest.getQueryToMethodConfig().keySet());
                    int i = strings.indexOf(methodConfig.getKey());
                    //Validating the data to method port configuration

                    String queryToMethodConfigJSON = methodConfig.getValue().toString();
//        WRONG Statement validation!
//        String queryToMethodConfigValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethods/" + indicatorRequest.getAnalyticsMethodId().get(methodConfig.getKey()) + "/validateConfiguration", queryToMethodConfigJSON);
                    String queryToMethodConfigValidJSON = Utils.performPutRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + indicatorRequest.getAnalyticsMethodId().get(String.valueOf(i)) + "/validateConfiguration", queryToMethodConfigJSON);
                    OpenLAPDataSetConfigValidationResult queryToMethodConfigValid = mapper.readValue(queryToMethodConfigValidJSON, OpenLAPDataSetConfigValidationResult.class);
                    if (!queryToMethodConfigValid.isValid()) {
                        indicatorResponse.setIndicatorSaved(false);
                        indicatorResponse.setErrorMessage("Query to Method Port-Configuration is not valid: " + queryToMethodConfigValid.getValidationMessage());
                        return indicatorResponse;
                    }
                    queryToMethodReference.getPortConfigs().put(methodConfig.getKey(), methodConfig.getValue());
                }

                String visFrameworkJSON = Utils.performGetRequest(baseUrl + "/frameworks/" + indicatorRequest.getVisualizationLibraryId());
                VisualizationLibrary frameworkResponse = mapper.readValue(visFrameworkJSON, VisualizationLibrary.class);
                String visMethodJSON = Utils.performGetRequest(baseUrl + "/frameworks/" + indicatorRequest.getVisualizationLibraryId() + "/methods/" + indicatorRequest.getVisualizationTypeId());
                VisualizationType methodResponse = mapper.readValue(visMethodJSON, VisualizationType.class);
                VisualizerReference visualizerReference = new VisualizerReference(frameworkResponse.getId(),
                        methodResponse.getId(),
                        indicatorRequest.getVisualizationInputParams());

                //Validating the method to visualization port configuration
                ValidateVisualizationTypeConfigurationRequest methodToVisConfigRequest = new ValidateVisualizationTypeConfigurationRequest();
                methodToVisConfigRequest.setConfigurationMapping(indicatorRequest.getMethodToVisualizationConfig());
                String visRequestJSON = mapper.writeValueAsString(methodToVisConfigRequest);
                ValidateVisualizationTypeConfigurationResponse methodToVisConfigValid = Utils.performJSONPostRequest(baseUrl + "/frameworks/" + indicatorRequest.getVisualizationLibraryId() + "/methods/" + indicatorRequest.getVisualizationTypeId() + "/validateConfiguration", visRequestJSON, ValidateVisualizationTypeConfigurationResponse.class);

                if (!methodToVisConfigValid.isConfigurationValid()) {
                    indicatorResponse.setIndicatorSaved(false);
                    indicatorResponse.setErrorMessage("Method to Visualization Port-Configuration is not valid: " + methodToVisConfigValid.getValidationMessage());
                    return indicatorResponse;
                }

                //Saving the triad
                Triad triad = new Triad(
                        indicatorReference,
                        methodReference,
                        visualizerReference,
                        queryToMethodReference,
                        indicatorRequest.getMethodToVisualizationConfig()
                );
                triad.setCreatedBy(indicatorRequest.getCreatedBy());
                triad.setParameters(indicatorRequest.getParameters());
                if (saveRequest.getIndicatorType().equals("Basic Indicator")) {
                    OpenLAPDataSet outputDataSourceByTriad = getOutputDataSourceByTriad(triad, baseUrl);
                    triad.setOpenLAPDataSet(outputDataSourceByTriad);
                }


                String triadJSON = mapper.writeValueAsString(triad);

                Triad savedTriad = Utils.performJSONPostRequest(baseUrl + "/analyticsmodule/AnalyticsModules/Triads/", triadJSON, Triad.class);


                String iFrameCode = "<iframe src='" + indicatorExecutionURL + "?triadID=" + savedTriad.getId() +
                        "' frameborder='0' height='500px' width='500px' />";

                indicatorResponse.setIndicatorSaved(true);
                indicatorResponse.setIndicatorClientID(indicatorRequest.getIndicatorClientID());
                indicatorResponse.setIndicatorRequestCode(iFrameCode);
            } catch (Exception exc) {

                indicatorResponse.setIndicatorSaved(false);
                indicatorResponse.setErrorMessage(exc.getMessage());
            }
        } else {
            try {

                String iFrameCode = "<iframe src='" + indicatorExecutionURL + "?triadID=" + triadById.getId() +
                        "' frameborder='0' height='500px' width='500px' />";

                indicatorResponse.setIndicatorSaved(true);
                indicatorResponse.setIndicatorClientID(indicatorRequest.getIndicatorClientID());
                indicatorResponse.setIndicatorRequestCode(iFrameCode);
//				indicatorResponse.setIndicatorRequestCode(getIndicatorRequestCode(savedTriad));

            } catch (Exception exc) {
                indicatorResponse.setIndicatorSaved(false);
                indicatorResponse.setErrorMessage(exc.getMessage());
            }
        }
        return indicatorResponse;
    }

    private String getIndicatorRequestCode(Triad triad) {
        String visFrameworkScript = "";
        try {
            visFrameworkScript = Utils.performGetRequest(visualizerURL + "/frameworks/" + triad.getVisualizationReference().getLibraryId() + "/methods/" + triad.getVisualizationReference().getTypeId() + "/LibraryScript");
            visFrameworkScript = Utils.decodeURIComponent(visFrameworkScript);
        } catch (Exception exc) {
            throw new ItemNotFoundException(exc.getMessage(), "1");
        }

        String indicatorRequestCode = "<table id='wait_" + triad.getId() + "' style='width: 96%;height: 96%;text-align: center;'><tr><td><img style='-webkit-user-select: none' src='https://www.microsoft.com/about/corporatecitizenship/en-us/youthspark/computerscience/teals/images/loading.gif'> " +
                " <br>Please wait the indicator is being processed</td></tr></table> " +
                visFrameworkScript +
                "<script type=\"text/javascript\"> " +
                "$(document).ready(function() {var xmlhttp_" + triad.getId() + "; " +
                "  if (window.XMLHttpRequest) { xmlhttp_" + triad.getId() + " = new XMLHttpRequest(); } else { xmlhttp_" + triad.getId() + " = new ActiveXObject('Microsoft.XMLHTTP'); } " +
                "  xmlhttp_" + triad.getId() + ".onreadystatechange = function (xmlhttp_" + triad.getId() + ") {  " +
                "   if (xmlhttp_" + triad.getId() + ".currentTarget.readyState == 4) {  " +
                "    $('#wait_" + triad.getId() + "').hide(); " +
                "    $('#main_" + triad.getId() + "').parent().parent().css('overflow','hidden'); " +
                "    $('#main_" + triad.getId() + "').show(); " +
                "    var decResult_" + triad.getId() + " = decodeURIComponent(xmlhttp_" + triad.getId() + ".currentTarget.responseText); " +
                "    $('#td_" + triad.getId() + "').append(decResult_" + triad.getId() + "); " +
                "   } " +
                "  }; " +
                "  xmlhttp_" + triad.getId() + ".open('GET', '" + indicatorExecutionURL + "?tid=" + triad.getId() + "&rid=xxxridxxx&width='+$('#main_" + triad.getId() + "').parent().width()+'&height='+$('#main_" + triad.getId() + "').parent().height(), true);  " +
                "  xmlhttp_" + triad.getId() + ".timeout = 300000; " +
                "  xmlhttp_" + triad.getId() + ".send(); });" +
                "</script> " +
                "<table id='main_" + triad.getId() + "'><tbody><tr> " +
                " <td id='td_" + triad.getId() + "' style='text-align:-webkit-center;text-align:-moz-center;text-align:-o-center;text-align:-ms-center;'></td></tr></tbody></table> ";

        return indicatorRequestCode;
    }

    private String getQuestionRequestCode(Set<Triad> triads) {

        StringBuilder requestCode = new StringBuilder();

        if (triads.size() > 0) {
            requestCode.append("<table style='width:100%;height:100%'>");
            int count = 1;

            for (Triad triad : triads) {

                if (count % 2 == 1) requestCode.append("<tr class='questionRows'>");

                requestCode.append("<td>");
                requestCode.append(getIndicatorRequestCode(triad));
                requestCode.append("</td>");

                if (count % 2 == 0) requestCode.append("</tr>");

                count++;
            }

            //adding  the closing tr if the number of triads are odd
            if (count % 2 == 0) requestCode.append("</tr>");

            requestCode.append("</table>");
        } else {
            requestCode.append("No indicators assoicated with the question.");
        }


        return requestCode.toString();
    }

    public OpenLAPDataSet transformIndicatorQueryToOpenLAPDatSet(List<?> dataList, OpenLAPPortConfigImp methodMapping) {
        OpenLAPDataSet dataset = new OpenLAPDataSet();

        boolean containEntity = false;

        // Creating columns based on the query to method configuration
        try {
            for (OpenLAPColumnConfigData column : methodMapping.getOutputColumnConfigurationData()) {
                if (!dataset.getColumns().containsKey(column.getId()))
                    dataset.addOpenLAPDataColumn(OpenLAPDataColumnFactory.createOpenLAPDataColumnOfType(column.getId(), column.getType(), false, column.getTitle(), column.getDescription()));

                //checking if any mapping have false which means a column needs data from Entity table
                if (!column.isRequired())
                    containEntity = true;
            }
        } catch (OpenLAPDataColumnException e) {
            e.printStackTrace();
        }
        return dataset;
    }

    public List<OpenLAPColumnConfigData> getAnalyticsMethodInputs(String id, HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        List<OpenLAPColumnConfigData> methodInputs = null;
        try {
            ObjectMapper mapper = new ObjectMapper();

            String methodInputsJSON = Utils.performGetRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + id + "/getInputPorts");
            methodInputs = mapper.readValue(methodInputsJSON, mapper.getTypeFactory().constructCollectionType(List.class, OpenLAPColumnConfigData.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return methodInputs;
    }

    public List<OpenLAPColumnConfigData> getAnalyticsMethodOutputs(String id, HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        List<OpenLAPColumnConfigData> methodInputs = null;

        try {
            ObjectMapper mapper = new ObjectMapper();

            String methodInputsJSON = Utils.performGetRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + id + "/getOutputPorts");
            methodInputs = mapper.readValue(methodInputsJSON, mapper.getTypeFactory().constructCollectionType(List.class, OpenLAPColumnConfigData.class));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return methodInputs;
    }

    public List<OpenLAPDynamicParam> getAnalyticsMethodDynamicParams(String id, HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        List<OpenLAPDynamicParam> methodParams = null;

        try {
            ObjectMapper mapper = new ObjectMapper();

            String methodInputsJSON = Utils.performGetRequest(baseUrl + "/AnalyticsMethod/AnalyticsMethods/" + id + "/getDynamicParams");
            methodParams = mapper.readValue(methodInputsJSON, mapper.getTypeFactory().constructCollectionType(List.class, OpenLAPDynamicParam.class));
            Collections.sort(methodParams, (OpenLAPDynamicParam o1, OpenLAPDynamicParam o2) -> (o1.getTitle().compareTo(o2.getTitle())));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return methodParams;
    }

    public List<OpenLAPColumnConfigData> getVisualizationMethodInputs(String frameworkId, String methodId, HttpServletRequest request) {

        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        List<OpenLAPColumnConfigData> methodInputs = null;

        try {
            ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);


            String methodInputsJSON = Utils.performGetRequest(baseUrl + "/frameworks/" + frameworkId + "/methods/" + methodId + "/configuration");
            VisualizationTypeConfigurationResponse visResponse = mapper.readValue(methodInputsJSON, VisualizationTypeConfigurationResponse.class);

            methodInputs = visResponse.getTypeConfiguration().getInput().getColumnsConfigurationData();

            Collections.sort(methodInputs, (OpenLAPColumnConfigData o1, OpenLAPColumnConfigData o2) -> (o1.getTitle().compareTo(o2.getTitle())));
        } catch (Exception exc) {
            System.out.println(exc.getMessage());
            return null;
        }

        return methodInputs;
    }

    public QuestionSaveResponse getQuestionRequestCode(String questionId, HttpServletRequest request) {

        QuestionSaveResponse questionSaveResponse = new QuestionSaveResponse();
        Question question = getQuestionById(questionId);

        if (question == null) {
            questionSaveResponse.setQuestionSaved(false);
            questionSaveResponse.setErrorMessage("Question with id '" + questionId + "' not found.");
            return questionSaveResponse;
        }

        List<IndicatorSaveResponse> indicatorSaveResponses = new ArrayList<IndicatorSaveResponse>();

        for (Triad triad : question.getTriads()) {
            IndicatorSaveResponse indicatorSaveResponse = new IndicatorSaveResponse();

            indicatorSaveResponse.setIndicatorSaved(true);
            indicatorSaveResponse.setIndicatorRequestCode(getIndicatorRequestCode(triad));
            indicatorSaveResponse.setErrorMessage(triad.getIndicatorReference().getIndicators().get("0").getIndicatorName());

            indicatorSaveResponses.add(indicatorSaveResponse);
            em.getTransaction().begin();
            em.persist(indicatorSaveResponse);
            em.flush();
            em.getTransaction().commit();
        }

        questionSaveResponse.setIndicatorSaveResponses(indicatorSaveResponses);
        questionSaveResponse.setQuestionRequestCode(getQuestionRequestCode(question.getTriads()));
        questionSaveResponse.setQuestionSaved(true);
        questionSaveResponse.setErrorMessage(question.getName());

        em.getTransaction().begin();
        em.persist(questionSaveResponse);
        em.flush();
        em.getTransaction().commit();

        return questionSaveResponse;
    }


    public OpenLapUser UserRegistration(OpenLapUser user) {

        OpenLapUser openlapUser = em.find(OpenLapUser.class, user.getEmail());
        if (openlapUser != null) {
            throw new UsernameNotFoundException("Email Already Exist");
        }
        OpenLapUser openLapUser = new OpenLapUser();
        openLapUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        openLapUser.setEmail(user.getEmail());
        openLapUser.setFirstname(user.getFirstname());
        openLapUser.setLastname(user.getLastname());
        openLapUser.setRoles(new HashSet(Arrays.asList("ADMIN")));

        em.getTransaction().begin();
        em.persist(openLapUser);
        em.flush();
        em.getTransaction().commit();
        return openLapUser;
    }

    public ResponseEntity<?> UserLogin(LoginUser loginUser) {

        OpenLapUser openlapUser = em.find(OpenLapUser.class, loginUser.getEmail());
        final Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword(),userService.getAuthority(openlapUser)));
        SecurityContextHolder.getContext().setAuthentication(authentication);
//        openlapUser.setPassword("");

        final String token = jwtTokenUtil.generateToken(authentication);
        TokenContextHolder.setToken(token);
        return ResponseEntity.ok(new AuthUser(openlapUser, token));
    }

    public OpenLAPDataSet getAllActivities() throws OpenLAPDataColumnException, JSONException {
        return activityServiceImp.getActivities(getId.apply(orgId), getId.apply(lrsId));
    }

    public OpenLAPDataSet getActivityExtensionId(String type) throws OpenLAPDataColumnException, JSONException {
        return activityServiceImp.getActivityExtensionId(getId.apply(orgId), getId.apply(lrsId), type);
    }

    public OpenLAPDataSet getActivitiesExtensionContextValues(String extensionId, String extensionContextKey) throws OpenLAPDataColumnException, JSONException {
        return activityServiceImp.getActivitiesExtensionContextValues(getId.apply(orgId), getId.apply(lrsId), extensionId, extensionContextKey);
    }


    public OpenLAPDataSet getKeysByContextualIdAndActivityType(String extensionId) throws OpenLAPDataColumnException, JSONException {
        return activityServiceImp.getKeysByContextualIdAndActivityType(getId.apply(orgId), getId.apply(lrsId), extensionId);
    }

    public OpenLAPDataSet getAllActions() throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getAllActions(getId.apply(orgId), getId.apply(lrsId));
    }

    public OpenLAPDataSet getAllPlatforms() throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getAllPlatforms(getId.apply(orgId), getId.apply(lrsId));
    }

    public String initializeDatabase(HttpServletRequest request) {
        String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());

        ObjectMapper mapper = new ObjectMapper();

        try {
            Utils.performGetRequest(baseUrl + "/analyticsmodule/AnalyticsModules/AnalyticsGoals/PopulateSampleGoals");
        } catch (Exception exc) {
            System.out.println("Adding Analytics Goals: " + exc.getMessage());
        }

        try {
            Utils.performGetRequest(baseUrl + "/AnalyticsMethod/PopulateAnalyticsMethods");
        } catch (Exception exc) {
            System.out.println("Adding Analytics Methods: " + exc.getMessage());
        }

        try {
            Utils.performGetRequest(baseUrl + "/frameworks/PopulateVisualizations");
        } catch (Exception exc) {
            System.out.println("Adding Visualization Techniques: " + exc.getMessage());
        }

        return "Success";
    }

    //  Created by: Shoeb Joarder
    public OpenLAPDataSet getActivityTypes() throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getActivityTypes(getId.apply(orgId), getId.apply(lrsId));
    }

    public OpenLAPDataSet getActivityTypeNames(String type) throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getActivityTypeNames(getId.apply(orgId), getId.apply(lrsId), type);
    }

    //  Fetch the extensions details of the object using object type
    public OpenLAPDataSet getActivityTypeExtensionId(String type) throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getActivityTypeExtensionId(getId.apply(orgId), getId.apply(lrsId), type);
    }

    //  Fetches the attributes of object type
    public OpenLAPDataSet getActivityTypeExtensionProperties(String type, String extensionId) throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getActivityTypeExtensionProperties(getId.apply(orgId), getId.apply(lrsId), type, extensionId);
    }

    //  Fetches the attribute values of the object type
    public OpenLAPDataSet getActivityTypeExtensionPropertyValues(String extensionId, String attribute) throws OpenLAPDataColumnException, JSONException {
        return statementServiceImp.getActivityTypeExtensionPropertyValues(getId.apply(orgId), getId.apply(lrsId), extensionId, attribute);
    }


}
