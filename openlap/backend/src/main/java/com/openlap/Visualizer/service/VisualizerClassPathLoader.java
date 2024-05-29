package com.openlap.Visualizer.service;

import com.openlap.Visualizer.exceptions.FileManagerException;
import com.openlap.template.VisualizationCodeGenerator;
import com.openlap.template.VisualizationLibraryInfo;
import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;
import org.xeustechnologies.jcl.exception.JclException;
import org.xeustechnologies.jcl.proxy.CglibProxyProvider;
import org.xeustechnologies.jcl.proxy.ProxyProviderFactory;

/**
 * A custom Java Class Path Loader that is responsible of loading JARs dynamically to the active ClassPath.
 * It uses the JCL';
 */
public class VisualizerClassPathLoader {

	private final JarClassLoader jcl;
	private final JclObjectFactory factory;

	/**
	 * Standard constructor that prepares this classpath loader to use the given JAR location to load classes from.
	 *
	 * @param visualizationMethodsJarsFolder JAR File where the desired loading classes are located.
	 */
	public VisualizerClassPathLoader(String visualizationMethodsJarsFolder) {

		//JCL object for loading jars
		jcl = new JarClassLoader();
		//Loading classes from different sources
		jcl.add(visualizationMethodsJarsFolder);

		// Set ClassPathLoader priorities to prevent collisions when loading
		jcl.getParentLoader().setOrder(1);
		jcl.getLocalLoader().setOrder(2);
		jcl.getSystemLoader().setOrder(3);
		jcl.getThreadLoader().setOrder(4);
		jcl.getCurrentLoader().setOrder(5);

		// Set default to cglib (from version 2.2.1)
		ProxyProviderFactory.setDefaultProxyProvider(new CglibProxyProvider());
		factory = JclObjectFactory.getInstance(true);
	}

	public VisualizationLibraryInfo loadLibraryInfo(String implementingClass) throws FileManagerException {
		VisualizationLibraryInfo libraryInfo;
		try {
			libraryInfo = (VisualizationLibraryInfo) factory.create(jcl, implementingClass);
			return libraryInfo;
		} catch (JclException e) {
			//e.printStackTrace();
			throw new FileManagerException("The class " + implementingClass +
					" was not found or does not implement the VisualizationLibraryInfo class.");
		} catch (NoSuchMethodError error) {
			//error.printStackTrace();
			throw new FileManagerException("The class " + implementingClass +
					" does not have an empty constructor.");
		}
	}

	public VisualizationCodeGenerator loadTypeClass(String implementingClass) throws FileManagerException {
		//Create object of loaded class
		VisualizationCodeGenerator vizCodeGenerator;
		try {
			vizCodeGenerator = (VisualizationCodeGenerator) factory.create(jcl, implementingClass);
			return vizCodeGenerator;
		} catch (JclException e) {
			//e.printStackTrace();
			throw new FileManagerException("The class " + implementingClass +
					" was not found or does not implement the VisualizationCodeGenerator class.");
		} catch (NoSuchMethodError error) {
			//error.printStackTrace();
			throw new FileManagerException("The class " + implementingClass +
					" does not have an empty constructor.");
		}
	}
}
