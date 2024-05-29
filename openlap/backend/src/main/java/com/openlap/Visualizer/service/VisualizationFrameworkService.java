package com.openlap.Visualizer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;
import com.openlap.Common.Utils;
import com.openlap.OpenLAPAnalyticsFramework;
import com.openlap.Visualizer.dtos.VisualizationTypeConfiguration;
import com.openlap.Visualizer.exceptions.*;
import com.openlap.Visualizer.framework.factory.VisualizationCodeGeneratorFactory;
import com.openlap.Visualizer.framework.factory.VisualizationCodeGeneratorFactoryImpl;
import com.openlap.Visualizer.model.VisualizationDataTransformerMethod;
import com.openlap.Visualizer.model.VisualizationLibrary;
import com.openlap.Visualizer.model.VisualizationType;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.DataSetValidationException;
import com.openlap.template.VisualizationCodeGenerator;
import com.openlap.template.VisualizationLibraryInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.transaction.TransactionManager;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * A service which provides functions to perform CRUD operations on the Visualization Frameworks or Visualization Types. In addition, also Types to get information about the stored
 * frameworks
 *
 * @author Bassim Bashir
 * @author Arham Muslim
 */
@Service
public class VisualizationFrameworkService {

	private static final Logger log = LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

	@Value("${visualizer.jars.folder}")
	String visualizationsJarsFolder;

	String jarFileDirectoryPathOfClassesExtendingVisualizationLibraryInfo = "openlap.visualizer.VisualizationInformation";
	String jarFileDirectoryPathOfClassesExtendingVisualizationCodeGenerator = "openlap.visualizer.Charts";
	TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
	EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
	EntityManager em = factory.createEntityManager();
	ObjectMapper objectMapper;
	@Autowired
	private FileManager fileManager;

	/**
	 * @return The list of VisualizationFrameworks existing in the system
	 */
	public List<VisualizationLibrary> fetchAllVisualizationLibrariesFromDatabase() {

		List<VisualizationLibrary> visualizationLibraries = em.createQuery("From VisualizationLibrary ORDER BY name ASC", VisualizationLibrary.class).getResultList();
		return visualizationLibraries;
	}

	public List<VisualizationType> fetchAllVisualizationTypeForCertainLibrary(String idOfLibrary){
		var visualizationLibrary =  findVisualizationLibrary(idOfLibrary);

		return visualizationLibrary.getVisualizationTypes();
	}

	/**
	 * @param idOfLibrary The id of the VisualizationLibrary to retrieve
	 * @return The VisualizationLibrary represented by the provided id
	 * @throws VisualizationLibraryNotFoundException when the framework was not found
	 */
	public VisualizationLibrary findVisualizationLibrary(String idOfLibrary) throws VisualizationLibraryNotFoundException {

		VisualizationLibrary visualizationLibrary = em.find(VisualizationLibrary.class, idOfLibrary);

		return visualizationLibrary;
	}

	/**
	 * @param idOfType The id of the VisualizationType to retrieve
	 * @return The VisualizationType represented by the provided id
	 * @throws VisualizationTypeNotFoundException when the Type was not found
	 */
	public VisualizationType findVisualizationType(String idOfType) throws VisualizationTypeNotFoundException {
		VisualizationType visualizationType = em.find(VisualizationType.class, idOfType);
		return visualizationType;
	}

	public String getLibraryScript(String idOfLibrary, String idOfType) {
		VisualizationType visualizationType = em.find(VisualizationType.class, idOfType);
		if (visualizationType != null) {
			VisualizationCodeGeneratorFactory visualizationCodeGeneratorFactory = new VisualizationCodeGeneratorFactoryImpl(visualizationType.getVisualizationLibrary().getFrameworkLocation());
			VisualizationCodeGenerator codeGenerator = visualizationCodeGeneratorFactory.createVisualizationCodeGenerator(visualizationType.getImplementingClass());
			return Utils.encodeURIComponent(codeGenerator.getVisualizationLibraryScript());
		} else {
			throw new DataSetValidationException("The visualization Type represented by the id: " + idOfType + " not found.");
		}
	}

	/**
	 * Performs the upload of the visualization Library by copying over the jar bundle and making the relevant Database entries
	 *
	 * @param jarFile     The jar bundle which contains the package Library implementation
	 * @throws VisualizationLibraryUploadException If the validation of the provided configuration failed or copying the provided jar file was not successful
	 */
	@Transactional(rollbackFor = {RuntimeException.class})
	public void uploadVisualizationLibraries(MultipartFile jarFile) throws VisualizationLibraryUploadException {
		String uniqueFileName = makeNameUnique(jarFile.getOriginalFilename());

		try {

			if (fileManager.fileExists(uniqueFileName) || jarFile.isEmpty())
				throw new VisualizationLibraryUploadException("The file being uploaded : " + jarFile.getOriginalFilename() + "  already exists or it is empty.");

			String savedFilePath = fileManager.saveJarFile(uniqueFileName, jarFile);

			VisualizationLibrary generatedVisualizationLibrary = generateVisualizationLibraryFromJarFile(savedFilePath);

			if (JarFileContentIsNotInDatabase(generatedVisualizationLibrary)){
				em.getTransaction().begin();
				em.persist(generatedVisualizationLibrary);
				em.flush();
				em.getTransaction().commit();
			}
		} catch (Exception e) {
			fileManager.deleteJarFile(uniqueFileName.toString());
			throw new VisualizationLibraryUploadException(e.getMessage());
		}
	}

	/**
	 * Removes a previously added VisualizationLibrary from the system. This includes all the Database entries alongwith the
	 * stored JAR (if no other Library is referencing it). DataTransformers will not be deleted as other VisualizationTypes in other Liberaries might reference them
	 *
	 * @param idOfLibrary The id of the VisualizationLibrary to delete.
	 * @return true if the deletion of the VisualizationLibrary was successful
	 * @throws VisualizationLibraryDeletionException if the deletion of the VisualizationLibrary encountered problems such as the file couldn't be removed
	 */
	@Transactional(rollbackFor = {RuntimeException.class})
	public void deleteVisualizationLibrary(String idOfLibrary) throws VisualizationLibraryDeletionException {
		VisualizationLibrary vizLibraryToDelete = em.find(VisualizationLibrary.class, idOfLibrary);

		if (vizLibraryToDelete == null)
			throw new VisualizationLibraryDeletionException("Could not delete the Library with id: " + idOfLibrary + ", not found");

		String jarFileLocation = vizLibraryToDelete.getFrameworkLocation();

		// delete the visualization library and its types
		em.getTransaction().begin();
		em.remove(vizLibraryToDelete);
		em.getTransaction().commit();

		boolean doOtherLibrariesReferenceTheJarFile = fetchAllVisualizationLibrariesFromDatabase().stream()
				.anyMatch(vizLibrary->vizLibrary.getFrameworkLocation().equals(jarFileLocation));

		if (!doOtherLibrariesReferenceTheJarFile) {
			try {
				fileManager.deleteFile(vizLibraryToDelete.getFrameworkLocation());
			} catch (FileManagerException fileManagerException) {
				throw new VisualizationLibraryDeletionException("Library delete from database, but its jar file is not delete. " + fileManagerException.getMessage());
			}
		}
	}

	/**
	 * Removes a previously added VisualizationType from the system along with all the VisualizationSuggestions which refer to it.
	 * DataTransformers will not be deleted as other VisualizationTypes might reference them
	 *
	 * @param idOfType The id of the VisualizationType to delete.
	 * @return true if the deletion of the VisualizationType was successful
	 * @throws VisualizationTypeDeletionException if the deletion of the VisualizationType encountered problems such as the file couldn't be removed
	 */
	@Transactional(rollbackFor = {RuntimeException.class})
	public void deleteVisualizationType(String idOfType) throws VisualizationTypeDeletionException {

		VisualizationType visualizationType = em.find(VisualizationType.class, idOfType);

		VisualizationLibrary visualizationLibrary = visualizationType.getVisualizationLibrary();

		if (visualizationType == null)
			throw new VisualizationTypeDeletionException("Could not delete the Type with id: " + idOfType + ", not found");

		em.getTransaction().begin();
		visualizationType.getVisualizationLibrary().getVisualizationTypes().remove(visualizationType);
		em.flush();
		em.getTransaction().commit();

		if (visualizationLibrary.getVisualizationTypes().size() == 0){
			deleteVisualizationLibrary(visualizationLibrary.getId());
		}
	}

	/**
	 * Removes a previously added DataTransformer from the system if no VisualizationType references it
	 *
	 * @param idOfTransformer The id of the DataTransformer to delete.
	 * @return true if the deletion of the DataTransformer was successful
	 * @throws DataTransformerDeletionException if the deletion of the DataTransformer encountered problems
	 */
	@Transactional(rollbackFor = {RuntimeException.class})
	public void deleteDataTransformer(String idOfTransformer) throws DataTransformerDeletionException {
		VisualizationDataTransformerMethod visualizationDataTransformerMethod = em.find(VisualizationDataTransformerMethod.class, idOfTransformer);
		if (visualizationDataTransformerMethod == null)
			throw new DataTransformerDeletionException("Could not delete the data transformer with id: " + idOfTransformer + ", not found");

		em.remove(visualizationDataTransformerMethod);
	}

	/**
	 * Updates the attributes of a VisualizationType
	 *
	 * @param newAttributes An instance filled with the new values of the visualization Type. Except for the visualization Library, the Type id and the data transformer id
	 *                      all other attributes can be updated
	 * @param id            the id of the VisualizationType to be updated
	 * @return VisualizationType the updated object of the VisualizationType
	 * @throws VisualizationTypeNotFoundException if the VisualizationType to update was not found
	 */
	public VisualizationType updateVisualizationTypeAttributes(VisualizationType newAttributes, String id) throws VisualizationTypeNotFoundException {
		VisualizationType visualizationType = em.find(VisualizationType.class, id);
		if (visualizationType == null)
			throw new VisualizationTypeNotFoundException("The VisualizationType with the id: " + id + " does not exist!");

		// update the name of the Type
		if (newAttributes.getName() != null && !newAttributes.getName().isEmpty())
			visualizationType.setName(newAttributes.getName());

		// update the implementing class
		if (newAttributes.getImplementingClass() != null && !newAttributes.getImplementingClass().isEmpty())
			visualizationType.setImplementingClass(newAttributes.getImplementingClass());
		// VisualizationTypeConfiguration visualizationTypeConfiguration = getTypeConfiguration(id);


		//if (newAttributes.getVisualizationDataTransformerMethod() != null) {
		//    VisualizationDataTransformerMethod visualizationDataTransformerMethod = em.find(VisualizationDataTransformerMethod.class, newAttributes.getVisualizationDataTransformerMethod().getId());
		//    if (visualizationDataTransformerMethod == null)
		//finally set the data transformer method
		//        visualizationType.setVisualizationDataTransformerMethod(visualizationDataTransformerMethod);
		//}

		//commit the changes
		em.getTransaction().begin();
		em.persist(newAttributes);
		em.flush();
		em.getTransaction().commit();

		return visualizationType;
	}

	/**
	 * Updates the attributes of a VisualizationLibrary
	 *
	 * @param newAttributes An instance filled with the new values of the visualization Library. Only the attributes namely, description and uploadedBy can be
	 *                      updated
	 * @param idOfLibraray  the id of the VisualizationLibrary to be updated
	 * @return The updated VisualizationLibrary object
	 * @throws VisualizationLibraryNotFoundException If the VisualizationLibrary to update was not found
	 */
	public VisualizationLibrary updateVisualizationLibraryAttributes(VisualizationLibrary newAttributes, String idOfLibraray) throws VisualizationLibraryNotFoundException {
		VisualizationLibrary visualizationLibrary = em.find(VisualizationLibrary.class, idOfLibraray);
		if (visualizationLibrary == null)
			throw new VisualizationLibraryNotFoundException("The Library with id: " + idOfLibraray + " does not exist!");

		if (newAttributes.getDescription() != null && !newAttributes.getDescription().isEmpty())
			visualizationLibrary.setDescription(newAttributes.getDescription());
		if (newAttributes.getCreator() != null && !newAttributes.getCreator().isEmpty())
			visualizationLibrary.setCreator(newAttributes.getCreator());

		em.getTransaction().begin();
		em.persist(visualizationLibrary);
		em.flush();
		em.getTransaction().commit();
		return visualizationLibrary;
	}

	/**
	 * Validates the configuration of the VisualizationType (i.e. the inputs that it accepts) with the provided OpenLAPPortConfigImp.
	 *
	 * @param visualizationTypeId   The id of the VisualizationType for which to validate the configuration
	 * @param olapPortConfiguration The OpenLAPPortConfigImp against which to validate the Type configuration
	 * @return true if the the provided port configuration matches the configuration of the VisualizationType
	 * @throws DataSetValidationException If the validation encountered an error
	 */
	public boolean validateVisualizationTypeConfiguration(String visualizationTypeId, OpenLAPPortConfigImp olapPortConfiguration) throws DataSetValidationException {
		VisualizationType visualizationType = em.find(VisualizationType.class, visualizationTypeId);
		if (visualizationType != null) {
			//ask the factories for the instance
			VisualizationCodeGeneratorFactory visualizationCodeGeneratorFactory = new VisualizationCodeGeneratorFactoryImpl(visualizationType.getVisualizationLibrary().getFrameworkLocation());
			VisualizationCodeGenerator codeGenerator = visualizationCodeGeneratorFactory.createVisualizationCodeGenerator(visualizationType.getImplementingClass());
			return codeGenerator.isDataProcessable(olapPortConfiguration);
		} else {
			throw new DataSetValidationException("The visualization Type represented by the id: " + visualizationTypeId + " not found.");
		}
	}

	/**
	 * Gets the configuration of a VisualizationType
	 *
	 * @param idOfType The id of the VisualizationType for which to get the configuration
	 * @return The VisualizationTypeConfiguration instance
	 * @throws VisualizationTypeNotFoundException if the VisualizationType was not found
	 */
	public VisualizationTypeConfiguration getTypeConfiguration(String idOfType) throws VisualizationTypeNotFoundException {
		VisualizationType visualizationType = em.find(VisualizationType.class, idOfType);
		if (visualizationType == null)
			throw new VisualizationTypeNotFoundException("The visualization Type with the id : " + idOfType + " does not exist.");

		//ask the factories for the instance
		VisualizationCodeGeneratorFactory visualizationCodeGeneratorFactory = new VisualizationCodeGeneratorFactoryImpl(visualizationType.getVisualizationLibrary().getFrameworkLocation());
		VisualizationCodeGenerator codeGenerator = visualizationCodeGeneratorFactory.createVisualizationCodeGenerator(visualizationType.getImplementingClass());
		// serialize and de-serialize the DataSet to avoid the issue with the ClassCastException, because the VisualizationCodeGenerator is loaded in another class loader
		//and the OpenLAPDataSet in this piece code is loaded in another.
		OpenLAPDataSet inputDataSet = null;
		OpenLAPDataSet outputDataSet = null;
		try {
			inputDataSet = codeGenerator.getInput();
			inputDataSet = objectMapper.readValue(codeGenerator.getInputAsJsonString(), OpenLAPDataSet.class);
			outputDataSet = objectMapper.readValue(codeGenerator.getOutputAsJsonString(), OpenLAPDataSet.class);
		} catch (Exception ex) {
			log.error("Error in deserializing codegenerator input/output config.", ex);
		}
		VisualizationTypeConfiguration visualizationTypeConfiguration = new VisualizationTypeConfiguration();
		visualizationTypeConfiguration.setInput(inputDataSet);
		visualizationTypeConfiguration.setOutput(outputDataSet);
		return visualizationTypeConfiguration;
	}


	public boolean populateVisualizations() {
		try (Stream<Path> walk = Files.walk(Paths.get(visualizationsJarsFolder))) {

			List<VisualizationLibrary> allVisualizationLibrariesFromDatabase = fetchAllVisualizationLibrariesFromDatabase();

			List<String> jarFiles = walk.filter(Files::isRegularFile).map(x -> x.toString()).collect(Collectors.toList());

			for (String jarFile : jarFiles) {

				VisualizationLibrary visualizationLibrary = createVisualizationLibraryFromJarFile(jarFile,
						jarFileDirectoryPathOfClassesExtendingVisualizationLibraryInfo, allVisualizationLibrariesFromDatabase);

				assignVisualTypesToGivenVisualLibrary(visualizationLibrary, jarFile, jarFileDirectoryPathOfClassesExtendingVisualizationCodeGenerator);

				try {
					em.getTransaction().begin();
					em.persist(visualizationLibrary);
					em.flush();
					em.clear();
					em.getTransaction().commit();
				} catch (DataIntegrityViolationException diException) {
					diException.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return true;
	}

	public VisualizationLibrary generateVisualizationLibraryFromJarFile(String jarFileNameAndLocation) {
		try{
			List<VisualizationLibrary> allVisualizationLibrariesFromDatabase = fetchAllVisualizationLibrariesFromDatabase();

			VisualizationLibrary visualizationLibrary = createVisualizationLibraryFromJarFile(jarFileNameAndLocation,
					jarFileDirectoryPathOfClassesExtendingVisualizationLibraryInfo, allVisualizationLibrariesFromDatabase);

			assignVisualTypesToGivenVisualLibrary(visualizationLibrary, jarFileNameAndLocation, jarFileDirectoryPathOfClassesExtendingVisualizationCodeGenerator);

			return visualizationLibrary;
		} catch (VisualizationLibraryUploadException e) {
			throw new VisualizationLibraryUploadException("Uploading jar file failed. " + e.getMessage());
		}
	}

	private VisualizationLibrary createVisualizationLibraryFromJarFile(String jarFileNameAndLocation, String directoryPathOfImplementedClassesInJarFile,
																	   List<VisualizationLibrary> allVisualizationLibrariesFromDatabase){

		List<String> classNamesOfVizLibsFromJarFile = Utils.getImplementedClassNamesFromJarFile(jarFileNameAndLocation,
				directoryPathOfImplementedClassesInJarFile);

		if (classNamesOfVizLibsFromJarFile.isEmpty())
			throw new VisualizationLibraryUploadException("Classes that extend 'VisualizationLibraryInfo' abstract class should be" +
					" under the directory '" + directoryPathOfImplementedClassesInJarFile +"'");

		if (classNamesOfVizLibsFromJarFile.size() > 1)
			throw new VisualizationLibraryUploadException("Number of classes that extend the 'VisualizationLibraryInfo' abstract class must be no more that 1.");

		VisualizationLibraryInfo vizLibInfo;

		try{
			vizLibInfo = new VisualizerClassPathLoader(jarFileNameAndLocation).
					loadLibraryInfo(classNamesOfVizLibsFromJarFile.get(0));
		}catch (Exception e){
			throw new VisualizationLibraryUploadException("No class extends the 'VisualizationLibraryInfo' abstract class.");
		}

		VisualizationLibrary matchingVisualizationLibraryFromDatabase = allVisualizationLibrariesFromDatabase.stream()
				.filter(vizLib -> vizLib.getName().equals(vizLibInfo.getName()))
				.findAny()
				.orElse(null);

		if (matchingVisualizationLibraryFromDatabase == null) {
			var visualizationLibrary = new VisualizationLibrary();

			visualizationLibrary.setName(vizLibInfo.getName());
			visualizationLibrary.setDescription(vizLibInfo.getDescription());
			visualizationLibrary.setCreator(vizLibInfo.getDeveloperName());
			visualizationLibrary.setFrameworkLocation(jarFileNameAndLocation);

			return visualizationLibrary;
		}
		else
			return matchingVisualizationLibraryFromDatabase;
	}

	private void assignVisualTypesToGivenVisualLibrary(VisualizationLibrary visualizationLibrary, String jarFileLocationAndName, String directoryPathOfImplementedClassesInJarFile){
		List<VisualizationType> newTypes;

		if (visualizationLibrary.getVisualizationTypes() == null)
			newTypes = new ArrayList<>();
		else
			newTypes = visualizationLibrary.getVisualizationTypes();

		List<String> classNamesOfVisualizationTypesFromJarFile = Utils.getImplementedClassNamesFromJarFile(jarFileLocationAndName,
				directoryPathOfImplementedClassesInJarFile);

		if (classNamesOfVisualizationTypesFromJarFile.isEmpty())
			throw new VisualizationLibraryUploadException("Classes that extend 'VisualizationCodeGenerator' abstract class should be" +
					" under the directory '" + directoryPathOfImplementedClassesInJarFile + "'");

		for (String className : classNamesOfVisualizationTypesFromJarFile) {
			try {
				if (!newTypes.stream().anyMatch(vizType -> vizType.getImplementingClass().equals(className))) {

					VisualizationType newVizType = new VisualizationType();

					newVizType.setName(new VisualizerClassPathLoader(jarFileLocationAndName).loadTypeClass(className).getName());
					newVizType.setImplementingClass(className);
					newVizType.setVisualizationLibrary(visualizationLibrary);

					visualizationLibrary.getVisualizationTypes().add(newVizType);
				}
			} catch (Exception e) {
				throw new VisualizationLibraryUploadException(className + " class does not extend 'VisualizationCodeGenerator' abstract class." );
			}
		}
	}

	private boolean JarFileContentIsNotInDatabase(VisualizationLibrary generatedVisualizationLibrary){
		List<VisualizationLibrary> allVisualizationLibrariesFromDatabase =  fetchAllVisualizationLibrariesFromDatabase();

		var matchingVisualizationLibrary = allVisualizationLibrariesFromDatabase.stream().filter(vl -> vl.getName().equals(generatedVisualizationLibrary.getName())).findFirst();

		if (!matchingVisualizationLibrary.isEmpty() && matchingVisualizationLibrary.get().getVisualizationTypes().stream().anyMatch(generatedVisualizationLibrary.getVisualizationTypes()::contains)){
			var matchingVisualizationType = matchingVisualizationLibrary.get().getVisualizationTypes().stream().
					filter(vl -> generatedVisualizationLibrary.getVisualizationTypes().contains(vl)).findFirst().get();

			throw new VisualizationLibraryUploadException("'" + matchingVisualizationType.getName() + "'" + " of " + generatedVisualizationLibrary.getName()
					+" library exists already in the database.");
		}

		return true;
	}

	private String makeNameUnique(String name){
		LocalDateTime currentDateTime = LocalDateTime.now();

		// Define the format for the date and time
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss");

		// Format the date and time into a string
		String formattedDateTime = currentDateTime.format(formatter);

		String fileName;

		if (name.contains(".jar")){
			String[] parts = name.split("\\.jar");
			fileName = parts[0];
		}
		else{
			fileName = name;
		}

		return fileName + "-"+ formattedDateTime + ".jar";
	}
}
