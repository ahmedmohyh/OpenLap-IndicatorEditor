package com.openlap.Visualizer.service;

import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;
import com.openlap.Visualizer.exceptions.VisualizationCodeGenerationException;
import com.openlap.Visualizer.framework.factory.VisualizationCodeGeneratorFactory;
import com.openlap.Visualizer.framework.factory.VisualizationCodeGeneratorFactoryImpl;
import com.openlap.Visualizer.model.VisualizationLibrary;
import com.openlap.Visualizer.model.VisualizationType;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.template.VisualizationCodeGenerator;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.transaction.TransactionManager;
import java.util.Map;

/**
 * Service which provides methods to generate visualization code. The service can thought of as the orchestrator which takes care of calling the
 * relevant data transformer to transform the data and then passing it over to the visualization code generator to the get the client visualization code
 *
 * @author Bassim Bashir
 */
@Service
public class VisualizationEngineService {

	TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
	EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
	EntityManager em = factory.createEntityManager();

	/**
	 * Generates the visualization code
	 *
	 * @param dataSet     The data set containing the data to visualize
	 * @param libraryName The name of the VisualizationFramework to use
	 * @param typeName    The name of the VisualizationType to use
	 * @return The client visualization code
	 * @throws VisualizationCodeGenerationException If the generation of the visualization code was not successful
	 */
	public String generateClientVisualizationCode(String libraryName, String typeName, OpenLAPDataSet dataSet, OpenLAPPortConfigImp portConfiguration, Map<String, Object> additionalParams) throws VisualizationCodeGenerationException, InstantiationException, IllegalAccessException {
		VisualizationLibrary visualizationLibrary = em.find(VisualizationLibrary.class, libraryName);
		VisualizationType visualizationType = em.find(VisualizationType.class, typeName);

       /* Optional<VisualizationType> visualizationType = visualizationLibrary.getVisualizationTypes()
                .stream()
                .filter((type) -> type.getName().equals((typeName)))
                .findFirst();*/

		if (visualizationType != null) {
			//visualization method found
			//VisualizationType visType = visualizationType.get();
			//ask the factories for the instances
			//DataTransformerFactory dataTransformerFactory = new DataTransformerFactoryImpl(visualizationLibrary.getFrameworkLocation());
			VisualizationCodeGeneratorFactory visualizationCodeGeneratorFactory = new VisualizationCodeGeneratorFactoryImpl(visualizationLibrary.getFrameworkLocation());
			VisualizationCodeGenerator codeGenerator = visualizationCodeGeneratorFactory.createVisualizationCodeGenerator(visualizationType.getImplementingClass());
			//DataTransformer dataTransformer = dataTransformerFactory.createDataTransformer(visualizationType.getVisualizationDataTransformerMethod().getImplementingClass());
			return codeGenerator.generateVisualizationCode(dataSet, portConfiguration, additionalParams);
		} else {
			throw new VisualizationCodeGenerationException("The method: " + typeName + " for the framework: " + libraryName + " was not found");
		}
	}

	/**
	 * Generates the visualization code
	 *
	 * @param olapDataSet The data set containing the data to visualize
	 * @param libraryId   The id of the VisualizationFramework to use
	 * @param typeId      The id of the VisualizationType to use
	 * @return The client visualization code
	 * @throws VisualizationCodeGenerationException If the generation of the visualization code was not successful
	 */
	public String generateClientVisualizationCodes(String libraryId, String typeId, OpenLAPDataSet olapDataSet, OpenLAPPortConfigImp portConfiguration, Map<String, Object> additionalParams) throws VisualizationCodeGenerationException, InstantiationException, IllegalAccessException {
		VisualizationLibrary visualizationLibrary = em.find(VisualizationLibrary.class, libraryId);
		VisualizationType visualizationType = em.find(VisualizationType.class, typeId);
/*        Optional<VisualizationType> visualizationType= visualizationLibrary.getVisualizationTypes()
                .stream()
                .filter((type) -> type.getId() == typeId)
                .findFirst();*/

		if (visualizationType != null) {
			//VisualizationType visMethod = visualizationType.get();

			//ask the factories for the instances
			//DataTransformerFactory dataTransformerFactory = new DataTransformerFactoryImpl(visualizationLibrary.getFrameworkLocation());
			VisualizationCodeGeneratorFactory visualizationCodeGeneratorFactory = new VisualizationCodeGeneratorFactoryImpl(visualizationLibrary.getFrameworkLocation());
			// DataTransformer dataTransformer = dataTransformerFactory.createDataTransformer(visualizationType.getVisualizationDataTransformerMethod().getImplementingClass());
			VisualizationCodeGenerator codeGenerator = visualizationCodeGeneratorFactory.createVisualizationCodeGenerator(visualizationType.getImplementingClass());
			return codeGenerator.generateVisualizationCode(olapDataSet, portConfiguration, additionalParams);
		} else {
			throw new VisualizationCodeGenerationException("The method: " + typeId + " for the framework: " + libraryId + " was not found");
		}
	}
}
