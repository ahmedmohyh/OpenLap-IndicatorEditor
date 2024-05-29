package com.openlap.AnalyticsModules.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodNotFoundException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import com.openlap.AnalyticsMethods.services.AnalyticsMethodsService;
import com.openlap.AnalyticsModules.exceptions.AnalyticsGoalNotFoundException;
import com.openlap.AnalyticsModules.exceptions.AnalyticsModulesBadRequestException;
import com.openlap.AnalyticsModules.exceptions.TriadNotFoundException;
import com.openlap.AnalyticsModules.model.AnalyticsGoal;
import com.openlap.AnalyticsModules.model.AnalyticsMethodParam;
import com.openlap.AnalyticsModules.model.Triad;
import com.openlap.OpenLAPAnalyticsFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.transaction.TransactionManager;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 This service handles the "business logic" of the macro component. It also works as a facade for other
 macro components that happen to be running on the same server, i.e. the Analytics Engine and Analytics Methods
 <p>
 Created by Faizan Riaz on 12.06.2019.
 */
@Service
public class AnalyticsModulesService {

    private static final Logger log = LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

    @Autowired
    AnalyticsMethodsService analyticsMethodsService;


    TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
    EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
    EntityManager em = factory.createEntityManager();
    //region Triads

    /**
     Saves a Triad with the given configuration (if any) to the Analytics Modules

     @param triad with reference to the Indicator, AnalyticsMethod and Visualization as well as the
     respective configurations. The AnalyticsMethod must exist.
     @return the saved Triad
     */
    public Triad saveTriad(Triad triad) throws AnalyticsMethodNotFoundException {
        // Check that the Analytics Method exists
        String id = null;
        boolean areAllMethodAvailable = true;
        String methodNotAvailableId = null;


        for (Map.Entry<String, AnalyticsMethodParam> methodEntry : triad.getAnalyticsMethodReference().getAnalyticsMethods().entrySet()) {
            String query = "FROM AnalyticsMethods";
            List<AnalyticsMethods> analyticsMethods = em.createQuery(query, AnalyticsMethods.class).getResultList();

            if (analyticsMethods == null) {
                areAllMethodAvailable = false;
                methodNotAvailableId = methodEntry.getValue().getId();
                break;
            }
        }


        if (areAllMethodAvailable) {
            try {
                em.getTransaction().begin();
                em.persist(triad);
                //Commit
                em.flush();
                em.getTransaction().commit();
                return triad;
            } catch (DataIntegrityViolationException sqlException) {
                sqlException.printStackTrace();
                throw new AnalyticsModulesBadRequestException("Analytics Goal already exists.");
            } catch (Exception e) {
                e.printStackTrace();
                throw new AnalyticsModulesBadRequestException(e.getMessage());
            }
        } else {
            throw new AnalyticsMethodNotFoundException("Method with id: {"
                    + methodNotAvailableId
                    + "} not found.");
        }
    }

    /**
     Get a Triad by it's ID

     @param id of the Triad
     @return the Triad with the specified ID
     */
    public Triad getTriadById(String id) throws TriadNotFoundException {
        Triad result = em.find(Triad.class, id);
        if (result == null || id == null) {
            throw new TriadNotFoundException("Triad with id: {" + id + "} not found");
        } else {
            //log.info("viewAnalyticsMethod returns " + result.toString());
            return result;
        }
    }

    /**
     Gets all the existing Triads on the system

     @return returns an ArrayList with all the existing Triads.
     */
    public List<Triad> getAllTriads() {
        String query = "From Triad";
        List<Triad> triads = em.createQuery(query).getResultList();
        return triads;
    }

    public List<Triad> getTriadsByUser(String userName) {

        String hql = "FROM Triad WHERE createdBy = :userName";
        Query query = em.createQuery(hql, Triad.class);
        query.setParameter("userName", userName);
        List<Triad> triad = query.getResultList();
        return triad;
    }

    /**
     Delete the specified Triad

     @param triadId id of the Triad to be deleted
     */
    public void deleteTriad(String triadId) {
        Triad triad = em.find(Triad.class, triadId);
        if (triad == null || triadId == null) {
            throw new TriadNotFoundException("Triad with id = {"
                    + triadId + "} not found.");
        }
        em.getTransaction().begin();
        em.remove(triad);
        em.getTransaction().commit();
    }

    /**
     Update the specified Triad with the specified the data sent

     @param triad Data of the Triad to be updated.
     @param id    of the Triad to be updated
     @return updated Triad
     */
    public Triad updateTriad(Triad triad, String id) {
        Triad responseTriad = em.find(Triad.class, id);
        if (responseTriad == null) {
            throw new AnalyticsModulesBadRequestException("Triad with id = {"
                    + id + "} not found.");
        }
        if (triad.getAnalyticsMethodReference() == null
                || triad.getIndicatorReference() == null
                || triad.getVisualizationReference() == null
        ) {
            throw new AnalyticsModulesBadRequestException("Input Triad for update is not a valid Triad");
        }

        em.getTransaction().begin();
        responseTriad.updateWithTriad(triad);
        em.persist(responseTriad);
        em.getTransaction().commit();
        return responseTriad;
    }

    //endregion

    //region AnalyticsGoals

    /**
     Gets a AnalyticsGoal by its ID

     @param id of the AnalyticsGoal
     @return the AnalyticsGoal with the specified ID
     */
    public AnalyticsGoal getAnalyticsGoalById(String id) {
        AnalyticsGoal result = em.find(AnalyticsGoal.class, id);
        if (result == null || id == null) {
            throw new AnalyticsGoalNotFoundException("AnalyticsGoal with id: {" + id + "} not found");
        } else {
            //log.info("getAnalyticsGoalById returns " + result.toString());
            return result;
        }
    }

    /**
     Creates an inactive AnalyticsGoal with no AnalyticsMethods related to it.

     @param analyticsGoal the AnalyticsGoal to be saved
     @return AnalyticsGoal saved with an ID
     */
    public AnalyticsGoal saveAnalyticsGoal(AnalyticsGoal analyticsGoal) {
        try {
            em.getTransaction().begin();
            em.persist(analyticsGoal);
            //Commit
            em.flush();
            em.getTransaction().commit();
            return analyticsGoal;
        } catch (DataIntegrityViolationException sqlException) {
            sqlException.printStackTrace();
            throw new AnalyticsModulesBadRequestException("Analytics Goal already exists.");
        } catch (Exception e) {
            e.printStackTrace();
            throw new AnalyticsModulesBadRequestException(e.getMessage());
        }
    }

    /**
     Gets all the existing AnalyticsGoals on the system

     @return returns an ArrayList with all the existing AnalyticsGoals.
     */
    public List<AnalyticsGoal> getAllAnalyticsGoals() {
        String query = "From AnalyticsGoal";
        List<AnalyticsGoal> analyticsGoals = em.createQuery(query, AnalyticsGoal.class).getResultList();
        return analyticsGoals;
    }


    /**
     Gets all the existing AnalyticsGoals on the system

     @return returns an ArrayList with all the existing AnalyticsGoals.
     */
    public List<AnalyticsGoal> getActiveAnalyticsGoals() {
        String query = "FROM AnalyticsGoal WHERE isActive = true ORDER by name ASC";
        List<AnalyticsGoal> analyticsGoals = em.createQuery(query).getResultList();
        return analyticsGoals;
    }

    /**
     Switches the active field of the AnalyticsGoal, only active AnalyticsGoals can add new AnalyticsMethods

     @param id of the AnalyticsGoal to be switched
     @return the saved AnalyticsGoal with the set active status
     */
    public AnalyticsGoal setAnalyticsGoalActive(String id, boolean status) {
        AnalyticsGoal analyticsGoal = em.find(AnalyticsGoal.class, id);
        analyticsGoal.setActive(status);
        return analyticsGoal;
    }

    /**
     Attach an AnalyticsMethodMetadata to a AnalyticsGoal

     @param id               the id of the AnalyticsGoal to attach the AnalyticsMethodMetadata to
     @param analyticsMethods the AnalyticsMethodMetadata to be attached
     @return the new AnalyticsGoal with the attached AnalyticsMethodMetadata
     */
    public AnalyticsGoal addAnalyticsMethodToAnalyticsGoal(String id, AnalyticsMethods analyticsMethods) {
        //Check that AnalyticsGoal exists
        //Check that AnalyticsMethod exists

        AnalyticsMethods requestedAnalyticsMethod = em.find(AnalyticsMethods.class, analyticsMethods.getId());
        AnalyticsGoal responseAnalyticsGoal = em.find(AnalyticsGoal.class, id);
        //Set<AnalyticsMethods> analyticsMethodsSet = new HashSet<AnalyticsMethods>();
        if (responseAnalyticsGoal == null) {
            throw new AnalyticsModulesBadRequestException("Analytics Goal with id = {"
                    + id + "} not found.");
        }
        if (requestedAnalyticsMethod == null) {
            throw new AnalyticsModulesBadRequestException("Analytics Method with id = {"
                    + analyticsMethods.getId() + "} not found.");
        }
        if (!responseAnalyticsGoal.isActive()) {
            throw new AnalyticsModulesBadRequestException("Analytics Goal with id = {"
                    + analyticsMethods.getId() + "} must be active to attach Analytics Methods to it.");
        }
        //Attach analyticsMethod if it does not exist in the AnalyticsGoal

        responseAnalyticsGoal.setAnalyticsMethods(requestedAnalyticsMethod);
        //Return the AnalyticsGoal with the attached
        em.getTransaction().begin();
        em.merge(responseAnalyticsGoal);
        em.flush();
        em.getTransaction().commit();


        return responseAnalyticsGoal;
    }

    /**
     Update the specified AnalyticsGoal with the specified the data sent

     @param analyticsGoal Data of the AnalyticsGoal to be updated. Note that the isActive, id and the AnalyticsMethods
     will not be updated using this method.
     @param id            of the AnalyticsGoal to be updated
     @return updated AnalyticsGoal
     */
    public AnalyticsGoal updateAnalyticsGoal(AnalyticsGoal analyticsGoal, String id) {
        em.getTransaction().begin();
        AnalyticsGoal responseAnalyticsGoal = em.find(AnalyticsGoal.class, id);
        if (responseAnalyticsGoal == null) {
            throw new AnalyticsGoalNotFoundException("Analytics Goal with id = {"
                    + id + "} not found.");
        }
        responseAnalyticsGoal.updateWithAnalyticsGoal(analyticsGoal);

        em.merge(responseAnalyticsGoal);
        em.flush();
        em.getTransaction().commit();

        return responseAnalyticsGoal;
    }

    /**
     Delete the specified AnalyticsGoal

     @param AnalyticsGoalId id of the AnalyticsGoal to be deleted
     */
    public void deleteAnalyticsGoal(String AnalyticsGoalId) {
        AnalyticsGoal analyticsGoal = em.find(AnalyticsGoal.class, AnalyticsGoalId);
        if (analyticsGoal == null || AnalyticsGoalId == null) {
            throw new AnalyticsGoalNotFoundException("Analytics Goal with id = {"
                    + AnalyticsGoalId + "} not found.");
        }
        em.getTransaction().begin();
        em.remove(analyticsGoal);
        em.getTransaction().commit();

    }

    public boolean populateSampleGoals() {
        List<AnalyticsGoal> goals;
        List<AnalyticsGoal> allGoals = getAllAnalyticsGoals();
        ObjectMapper mapper = new ObjectMapper();

        try {
            em.getTransaction().begin();

            try {
                File jsonFile = ResourceUtils.getFile("classpath:SampleGoal.json");
                goals = mapper.readValue(jsonFile, mapper.getTypeFactory().constructCollectionType(List.class, AnalyticsGoal.class));

                for (AnalyticsGoal goal : goals) {
                    if (!allGoals.stream().anyMatch(c -> c.getName().equals(goal.getName())))
                        em.persist(goal);
                }

            } catch (IOException e) {
                e.printStackTrace();
            }

            em.flush();
            em.clear();
            em.getTransaction().commit();
        } catch (DataIntegrityViolationException sqlException) {
            sqlException.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    //endregion
}
