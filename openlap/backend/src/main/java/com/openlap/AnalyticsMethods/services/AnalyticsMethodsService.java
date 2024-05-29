package com.openlap.AnalyticsMethods.services;


import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodLoaderException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodNotFoundException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsUploadErrorException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;
import com.openlap.Common.Utils;
import com.openlap.OpenLAPAnalyticsFramework;
import com.openlap.dataset.OpenLAPColumnConfigData;
import com.openlap.dataset.OpenLAPColumnDataType;
import com.openlap.dataset.OpenLAPDataSetConfigValidationResult;
import com.openlap.dynamicparam.OpenLAPDynamicParam;
import com.openlap.template.AnalyticsMethod;
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
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * This service handles the "business logic" of the macro component. It also works as a facade for other
 * macro components that happen to be running on the same server, i.e. the Analytics Engine and Analytics Modules
 * <p>
 * Created by Faizan Riaz on 12/06/19.
 */

@Service
//@ContextConfiguration(classes = OpenLAPAnalyaticsFramework.class)
public class AnalyticsMethodsService {

	// Strings for method names
	private static final String JAR_EXTENSION = ".jar";
	private static final String INPUT_PORTS = "input";
	private static final String OUTPUT_PORTS = "output";
	private static final Logger log = LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

	@Value("${analytics.jars.folder}")
	String analyticsMethodsJarsFolder;

	@Autowired
	AnalyticsMethodsUploadValidator validator;

	TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
	EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
	EntityManager em = factory.createEntityManager();

	public AnalyticsMethodsClassPathLoader getFolderNameFromResources() {
		AnalyticsMethodsClassPathLoader classPathLoader = new AnalyticsMethodsClassPathLoader(analyticsMethodsJarsFolder);
		return classPathLoader;
	}

	public AnalyticsMethodsClassPathLoader getFolderNameFromResources(String jarFileName) {
		AnalyticsMethodsClassPathLoader classPathLoader = new AnalyticsMethodsClassPathLoader(jarFileName);
		return classPathLoader;
	}

	public AnalyticsMethod loadAnalyticsMethodInstance(String analyticsMethodId, AnalyticsMethodsClassPathLoader classPathLoader) throws AnalyticsMethodLoaderException {
		AnalyticsMethods analyticsMethodMetadata = em.find(AnalyticsMethods.class, analyticsMethodId);
		if (analyticsMethodMetadata == null || analyticsMethodId == null) {
			throw new AnalyticsMethodNotFoundException("Analytics Method with id not found: " + analyticsMethodId);
		} else {

			AnalyticsMethod method;

			// AnalyticsMethodsClassPathLoader classPathLoader =  new AnalyticsMethodsClassPathLoader(analyticsMethodsJarsFolder);
			method = classPathLoader.loadClass(analyticsMethodMetadata.getImplementing_class());
			return method;
		}
	}

	/**
	 * Lists all the Metadata of the  AnalyticsMethods available
	 *
	 * @return A List of the available AnalyticsMethods
	 */
	public List<AnalyticsMethods> getAllAnalyticsMethodsFromDatabase() {
		String query = "From AnalyticsMethods a ORDER by a.name  ASC";
		List<AnalyticsMethods> analyticsMethodsModels = em.createQuery(query, AnalyticsMethods.class).getResultList();
		return analyticsMethodsModels;
	}

	/**
	 * Returns the Metadata of the Analytics Method of the specified ID
	 *
	 * @param id ID of the AnalyticsMethods to view
	 * @return The AnalyticsMethods with Metadata of the specified ID
	 * @throws AnalyticsMethodNotFoundException
	 */
	public AnalyticsMethods viewAnalyticsMethod(String id) throws AnalyticsMethodNotFoundException {
		AnalyticsMethods analyticsMethods = em.find(AnalyticsMethods.class, id);
		return analyticsMethods;
	}

	/**
	 * Post an AnalyticsMethods to the Server to be validated and made available for usage.
	 *
	 * @param jarFile       The JAR file with the implementation of the AnalyticsMethods
	 * @return The Metadata of the uploaded AnalyticsMethods if deemed valid by the OpenLAP
	 */
	public void uploadAnalyticsMethod(MultipartFile jarFile) {

		if (jarFile.isEmpty())
			throw new AnalyticsMethodsBadRequestException("Empty jar file.");

		try {
			String savedFileName = saveJarFile(jarFile);

			List<AnalyticsMethods> analyticsMethodsFromJarFile = generateMethodsFromJarFile(
					analyticsMethodsJarsFolder + savedFileName + JAR_EXTENSION);

			if (analyticsMethodsFromJarFile.size() == 0){
				deleteSavedJarFile(savedFileName);
				throw new AnalyticsMethodsBadRequestException("Incorrect GroupId was set in the project or no class extends AnalyticsMethod class.");
			}

			analyticsMethodsFromJarFile.stream().forEach(am -> validateMethodAndDeleteJarIfInvalid(am, savedFileName));

			List<AnalyticsMethods> allAnalyticsMethodsFromDatabase = getAllAnalyticsMethodsFromDatabase();

			for (var analyticsMethod: analyticsMethodsFromJarFile) {
				if (isMethodPresentInDatabase(analyticsMethod, allAnalyticsMethodsFromDatabase)){
					deleteSavedJarFile(savedFileName);
					throw new AnalyticsMethodsUploadErrorException("'" + analyticsMethod.getName() + "'" + " exists already in the database.");
				}
			}

			analyticsMethodsFromJarFile.stream().forEach(am -> writeMethodToDatabase(am));
		} catch (Exception e) {
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	/**
	 * Update an AnalyticsMethods to the Server to be validated and made available for usage.
	 *
	 * @param jarFile        The JAR file with the implementation of the AnalyticsMethods
	 * @return The Metadata of the uploaded AnalyticsMethods if deemed valid by the OpenLAP
	 */
	public void updateAnalyticsMethod(MultipartFile jarFile) {
		if (jarFile.isEmpty())
			throw new AnalyticsMethodsBadRequestException("Empty jar file.");

		try {
			String savedFileName = saveJarFile(jarFile);

			List<AnalyticsMethods> analyticsMethodsFromJarFile = generateMethodsFromJarFile(
					analyticsMethodsJarsFolder + savedFileName + JAR_EXTENSION);

			if (analyticsMethodsFromJarFile.size() == 0)
				throw new AnalyticsMethodsBadRequestException("Incorrect GroupId was set in the project or no class extends AnalyticsMethod class.");

			analyticsMethodsFromJarFile.stream().forEach(am -> validateMethodAndDeleteJarIfInvalid(am, savedFileName));

			List<AnalyticsMethods> allAnalyticsMethodsFromDatabase = getAllAnalyticsMethodsFromDatabase();

			for (var analyticsMethod: analyticsMethodsFromJarFile) {
				if (isMethodPresentInDatabase(analyticsMethod, allAnalyticsMethodsFromDatabase))
					updateAnalyticsMethodInDatabase(analyticsMethod, allAnalyticsMethodsFromDatabase);
				else
					writeMethodToDatabase(analyticsMethod);
			}
		}  catch (Exception e) {
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	/**
	 * Method that allows to validate an OpenLAPPortConfigImp of a specific AnalyticsMethods.
	 *
	 * @param analyticsMethodId ID of the AnalyticsMethods Metadata to be validated against the OpenLAPPortConfigImp.
	 * @param configuration     The OpenLAPPortConfigImp to be validated
	 * @return An Object with the validation information of the OpenLAPPortConfigImp against the specified Analytics
	 * Method.
	 * @throws AnalyticsMethodLoaderException
	 */
	public OpenLAPDataSetConfigValidationResult validateConfiguration(
			String analyticsMethodId, OpenLAPPortConfigImp configuration) throws AnalyticsMethodLoaderException {
		//log.info("Attempting to validateConfiguration :" + configuration.getMapping()
		//        + "for method with id: " + analyticsMethodId);

		AnalyticsMethod method = loadAnalyticsMethodInstance(analyticsMethodId, this.getFolderNameFromResources());
		return method.getInput().validateConfiguration(configuration);
	}

	/**
	 * A Method that creates an instance of an AnalyticsMethods object from the JAR location contained in the
	 * corresponding AnalyticsMethodMetadata.
	 *
	 * @param analyticsMethodId The ID of the Analytics Method to instantiate
	 * @return A new instance of the specified Analytics Method.
	 * @throws AnalyticsMethodLoaderException
	 */
    public AnalyticsMethod loadAnalyticsMethodInstance(String analyticsMethodId) throws AnalyticsMethodLoaderException {
		AnalyticsMethods analyticsMethodMetadata = em.find(AnalyticsMethods.class, analyticsMethodId);
		if (analyticsMethodMetadata == null || analyticsMethodId == null) {
			throw new AnalyticsMethodNotFoundException("Analytics Method with id not found: " + analyticsMethodId);
		} else {

			AnalyticsMethod method;

			AnalyticsMethodsClassPathLoader classPathLoader =  new AnalyticsMethodsClassPathLoader("./analyticsMethodsJars/" );
			method = classPathLoader.loadClass(analyticsMethodMetadata.getImplementing_class());
			return method;
		}
	}

	/**
	 * Method that returns the OpenLAPColumnConfigData of the input ports of a specific AnalyticsMethods
	 *
	 * @param id ID of the AnalyticsMethods Metadata
	 * @return A list of OpenLAPColumnConfigData corresponding to the input ports of the AnalyticsMethods
	 */
	public List<OpenLAPColumnConfigData> GetInputPortsForMethod(String id) {
		return getPortsForMethod(id, INPUT_PORTS);
	}

	/**
	 * Method that returns the OpenLAPColumnConfigData of the output ports of a specific AnalyticsMethods
	 *
	 * @param id ID of the AnalyticsMethods Metadata
	 * @return A list of OpenLAPColumnConfigData corresponding to the output ports of the AnalyticsMethods
	 */
	public List<OpenLAPColumnConfigData> GetOutputPortsForMethod(String id) {
		return getPortsForMethod(id, OUTPUT_PORTS);
	}

	public List<OpenLAPDynamicParam> GetDynamicParamsForMethod(String id) {
		AnalyticsMethod method = loadAnalyticsMethodInstance(id, this.getFolderNameFromResources());

		return method.getParams().getParamsAsList(false);
	}

	/**
	 * Returns a List of OpenLAPColumnConfigData of either the Input ports or output ports of the Analytics Method
	 * of the given <code>id</code>.
	 *
	 * @param id            of the Analytics Method
	 * @param portParameter Either <code>INPUT_PORT</code> or <code>OUTPUT_PORTS</code>
	 * @return List of the OpenLAPColumnConfigData corresponding to the inputs or outputs of the Analytics Method
	 * @throws AnalyticsMethodLoaderException
	 */
	private List<OpenLAPColumnConfigData> getPortsForMethod(String id, String portParameter)
			throws AnalyticsMethodLoaderException {

		AnalyticsMethod method = loadAnalyticsMethodInstance(id, this.getFolderNameFromResources());
		//log.info("Attempting to return " + portParameter + " ports of the method with id {" + id + "}");

		List<OpenLAPColumnConfigData> ports;

		switch (portParameter) {
			case INPUT_PORTS:
				ports = method.getInputPorts();
				break;
			case OUTPUT_PORTS:
				ports = method.getOutputPorts();
				break;
			default:
				throw new AnalyticsMethodsBadRequestException("Only can return Inputs or Outputs");
		}

		Collections.sort(ports, (OpenLAPColumnConfigData o1, OpenLAPColumnConfigData o2) -> (o1.getTitle().compareTo(o2.getTitle())));

		return ports;
	}

	/**
	 * Delete the specified AnalyticsMethods
	 *
	 * @param id id of the AnalyticsMethods to be deleted
	 */
	public void deleteMethodWithJar(String id) {
		try {
			em.getTransaction().begin();

			AnalyticsMethods analyticsMethod = em.find(AnalyticsMethods.class, id);

			if (analyticsMethod == null || id == null)
				throw new AnalyticsMethodNotFoundException("Analytics Method with id = {" + id + "} not found.");

			em.remove(analyticsMethod);

			em.getTransaction().commit();

			if (!getAllAnalyticsMethodsFromDatabase().stream().anyMatch(am -> am.getFilename().equals(analyticsMethod.getFilename()))){
				deleteSavedJarFileWithNameThatHasJarExtensionAtTheEnd(analyticsMethod.getFilename());
				log.info("Deleted file: " + analyticsMethod.getFilename());
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	public boolean populateAnalyticsMethods() {
		List<AnalyticsMethods> allAnalyticsMethods = getAllAnalyticsMethodsFromDatabase();

		try (Stream<Path> walk = Files.walk(Paths.get(analyticsMethodsJarsFolder))) {

			List<String> jarFiles = walk.filter(Files::isRegularFile)
									.map(x -> x.toString()).collect(Collectors.toList());

			for (String jarFile : jarFiles) {
				var newMethods = generateMethodsFromJarFile(jarFile);

				try {
					em.getTransaction().begin();

					for (AnalyticsMethods method : newMethods) {
						if (!allAnalyticsMethods.stream().anyMatch(c -> c.getImplementing_class().equals(method.getImplementing_class()))){
							em.persist(method);
						}
					}

					em.flush();
					em.clear();
					em.getTransaction().commit();
				} catch (DataIntegrityViolationException sqlException) {
					sqlException.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

		return true;
	}

	private List<AnalyticsMethods> generateMethodsFromJarFile(String jarFileLocationAndName){

		List<AnalyticsMethods> newMethods = new ArrayList<>();

		List<String> classNames = Utils.getImplementedClassNamesFromJarFile(jarFileLocationAndName,
				"com.openlap.AnalyticsMethods.Prototypes");

		AnalyticsMethodsClassPathLoader analyticsMethodsClassPathLoader = getFolderNameFromResources(jarFileLocationAndName);

		for (String className : classNames) {

			try {
				AnalyticsMethod method = analyticsMethodsClassPathLoader.loadClass(className);

				AnalyticsMethods newMethod = new AnalyticsMethods();

				newMethod.setName(method.getAnalyticsMethodName());
				newMethod.setDescription(method.getAnalyticsMethodDescription());
				newMethod.setCreator(method.getAnalyticsMethodCreator());
				newMethod.setImplementing_class(className);
				newMethod.setFilename(jarFileLocationAndName);
				newMethod.setType(method.getType());

				String ids = "";
				for (int i = 0; i < method.getOutputPorts().size(); i++) {
					if (method.getOutputPorts().get(i).getType().equals(OpenLAPColumnDataType.Numeric)) {
						ids = ids + method.getOutputPorts().get(i).getId() + ",";
					}
				}
				newMethod.setOutputs(ids.substring(0, ids.length() - 1));

				newMethods.add(newMethod);
			} catch (Exception e) {
				throw new AnalyticsMethodsBadRequestException("Class does not inherit 'Analytics Method' class :" + className);
			}
		}

		return newMethods;
	}

	private boolean isMethodPresentInDatabase(AnalyticsMethods analyticsMethod, List<AnalyticsMethods> allAnalyticsMethods) {
		return allAnalyticsMethods.stream()
				.anyMatch(method -> method.getName().equals(analyticsMethod.getName()));
	}

	private void updateAnalyticsMethodInDatabase(AnalyticsMethods analyticsMethod, List<AnalyticsMethods> allAnalyticsMethods) {
		allAnalyticsMethods.stream()
				.filter(method -> method.getName().equals(analyticsMethod.getName()))
				.findFirst()
				.ifPresent(method -> {
					method.updateWithMetadata(analyticsMethod);
					writeMethodToDatabase(method);
				});
	}

	@Transactional
	public void writeMethodToDatabase(AnalyticsMethods analyticsMethod){
		try {
			tm.begin();
			em.persist(analyticsMethod);
			em.flush();
			tm.commit();
		}
		catch (Exception e) {
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	private void validateMethodAndDeleteJarIfInvalid(AnalyticsMethods analyticsMethod, String savedFileName){
		AnalyticsMethodsValidationInformation validationInformation = validator.validatemethod(analyticsMethod, analyticsMethodsJarsFolder);

		if (!validationInformation.isValid()) {
			deleteSavedJarFile(savedFileName);
			throw new AnalyticsMethodsUploadErrorException("'" + analyticsMethod.getName() + "'" + " is probably not correctly defined. "
					+ validationInformation.getMessage());
		}
	}

	private String saveJarFile(MultipartFile jarFile){
		AnalyticsMethodsFileHandler fileHandler = new AnalyticsMethodsFileHandler(log);

		LocalDateTime currentDateTime = LocalDateTime.now();

		// Define the format for the date and time
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss");

		// Format the date and time into a string
		String formattedDateTime = currentDateTime.format(formatter);

		String fileName;

		if (jarFile.getOriginalFilename().contains(".jar")){
			String[] parts = jarFile.getOriginalFilename().split("\\.jar");
			fileName = parts[0];
		}
		else{
			fileName = jarFile.getOriginalFilename();
		}

		String uniqueFileName = fileName + "-"+ formattedDateTime;

		try{
			fileHandler.saveFile(jarFile, analyticsMethodsJarsFolder, uniqueFileName + JAR_EXTENSION);
			return uniqueFileName;
		}catch (Exception e){
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException("Saving the jar file failed");
		}
	}

	private void deleteSavedJarFile(String savedFileName){
		AnalyticsMethodsFileHandler fileHandler = new AnalyticsMethodsFileHandler(log);
		fileHandler.deleteFile(analyticsMethodsJarsFolder, savedFileName + JAR_EXTENSION);
	}

	private void deleteSavedJarFileWithNameThatHasJarExtensionAtTheEnd(String savedFileName){
		File fileToDelete = new File(savedFileName);
		fileToDelete.delete();
	}
}
