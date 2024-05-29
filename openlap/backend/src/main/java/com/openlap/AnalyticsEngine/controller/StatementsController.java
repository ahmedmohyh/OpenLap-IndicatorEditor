package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.dto.LrsObjects;
import com.openlap.AnalyticsEngine.dto.QueryParameters;
import com.openlap.AnalyticsEngine.service.StatementService;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/v1/statements/")
public class StatementsController {

    @Autowired
    private StatementService statementService;

    /**
     * This function can only be executed if http request contains Bearer token(JWT
     * token received through login request) and logged user role should be
     * site_admin
     *
     * @param organizationId
     * @param lrsId
     * @return OpenLAPDataSet of all the verbs saved through xAPI statements
     * @throws IOException
     * @throws JSONException
     * @throws OpenLAPDataColumnException
     */
//	@PreAuthorize("hasRole('site_admin')")
    @RequestMapping(value = "/verbs/list", method = RequestMethod.GET)
    @ResponseBody
    public OpenLAPDataSet verbsList(@RequestParam("OrganizationId") ObjectId organizationId,
                                    @RequestParam("LrsId") ObjectId lrsId) throws IOException, JSONException, OpenLAPDataColumnException {

        return statementService.getAllActions(organizationId, lrsId);
    }

    /**
     * This function can only be executed if http request contains Bearer token(JWT
     * token received through login request) and logged user role should be
     * site_admin
     *
     * @param queryParameters
     * @return
     * @throws IOException
     * @throws JSONException
     * @throws OpenLAPDataColumnException
     */
//	@PreAuthorize("hasRole('site_admin')")
    //// @PreAuthorize("hasAnyRole('USER', 'site_admin')")
    @RequestMapping(value = "/list/ByCustomQuery", method = RequestMethod.POST)
    @ResponseBody
    public OpenLAPDataSet statementsByCustomQuery(
            @RequestParam("OrganizationId") ObjectId organizationId,
            @RequestParam("LrsId") ObjectId lrsId,
            @RequestBody QueryParameters queryParameters
    ) throws IOException, JSONException, OpenLAPDataColumnException {
        OpenLAPDataSet queryResult = statementService.getAllStatementsByCustomQuery(
                organizationId,
                lrsId,
                queryParameters
        );
        return queryResult;
    }

    /**
     * This function can only be executed if http request contains Bearer token(JWT
     * token received through login request) and logged user role should be
     * site_admin
     *
     * @param queryParameters
     * @return
     * @throws IOException
     * @throws JSONException
     * @throws OpenLAPDataColumnException
     */
//	@PreAuthorize("hasRole('site_admin')")
    //// @PreAuthorize("hasAnyRole('USER', 'site_admin')")
    @RequestMapping(value = "/list/customQueryUnique", method = RequestMethod.POST)
    @ResponseBody
    public OpenLAPDataSet customQueryUnique(
            @RequestParam("OrganizationId") ObjectId organizationId,
            @RequestParam("LrsId") ObjectId lrsId,
            @RequestBody QueryParameters queryParameters
    ) throws IOException, JSONException, OpenLAPDataColumnException {
        OpenLAPDataSet queryResult = statementService.getCustomQueryUnique(
                organizationId,
                lrsId,
                queryParameters
        );
        return queryResult;
    }

    //@RequestMapping(value = "/list/customQueryAll", method = RequestMethod.POST)
    //@ResponseBody
    //public List<LrsObjects> customQueryAll(
    //		@RequestParam("OrganizationId") ObjectId organizationId,
    //		@RequestParam("LrsId") ObjectId lrsId,
    //		@RequestBody QueryParameters queryParameters
    //) throws IOException, JSONException, OpenLAPDataColumnException {
    //	List<LrsObjects> queryResult = statementService.getCustomQueryAll(
    //			organizationId,
    //			lrsId,
    //			queryParameters
    //	);
    //	return queryResult;
    //}

    @GetMapping("/list/customQueryAll")
    @ResponseBody
    public Object testMongo(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") int pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "20") int pageSize
    ) throws IOException, JSONException, OpenLAPDataColumnException {
        return statementService.getCustomQueryAll(pageNumber, pageSize);
    }

}

