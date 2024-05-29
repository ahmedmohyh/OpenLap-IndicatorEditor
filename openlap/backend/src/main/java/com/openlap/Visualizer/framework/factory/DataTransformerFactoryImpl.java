package com.openlap.Visualizer.framework.factory;

import com.openlap.Visualizer.exceptions.DataTransformerCreationException;
import com.openlap.template.DataTransformer;
import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;
import org.xeustechnologies.jcl.exception.JclException;
import org.xeustechnologies.jcl.proxy.CglibProxyProvider;
import org.xeustechnologies.jcl.proxy.ProxyProviderFactory;

import java.io.InputStream;

/**
 * A concrete implementation of the DataTransformerFactory interface, providing a method for the creation of the
 * DataTransformer adapters. Uses the JCL (https://github.com/kamranzafar/JCL) library
 *
 * @author Bassim Bashir
 */
public class DataTransformerFactoryImpl implements DataTransformerFactory {

	private JclObjectFactory jclObjectFactory;
	private final JarClassLoader jarClassLoader;

	public DataTransformerFactoryImpl(String locationOfJar) {
		jarClassLoader = new JarClassLoader();
		//try {
		//jarClassLoader.add(new FileInputStream(new File(locationOfJar)));
		jarClassLoader.add(locationOfJar);
        /*}catch (IOException ioException){
            throw new DataTransformerCreationException(ioException.getMessage());
        }*/
		initializeClassLoader();
	}

	public DataTransformerFactoryImpl(InputStream jarStream) {
		jarClassLoader = new JarClassLoader();
		jarClassLoader.add(jarStream);
		initializeClassLoader();
	}

	private void initializeClassLoader() {
    /*    jarClassLoader.getThreadLoader().setOrder(1);
        jarClassLoader.getCurrentLoader().setOrder(2);

        jarClassLoader.getParentLoader().setEnabled(false);
        jarClassLoader.getSystemLoader().setEnabled(false);
        jarClassLoader.getLocalLoader().setEnabled(false);

*/
		jarClassLoader.getParentLoader().setOrder(2);
		jarClassLoader.getLocalLoader().setOrder(4);
		jarClassLoader.getSystemLoader().setOrder(5);
		jarClassLoader.getThreadLoader().setOrder(3);
		jarClassLoader.getCurrentLoader().setOrder(1);
		// Set default to cglib (from version 2.2.1)
		ProxyProviderFactory.setDefaultProxyProvider(new CglibProxyProvider());

		//Create a factory of castable objects/proxies
		jclObjectFactory = JclObjectFactory.getInstance(true);
	}

	@Override
	public DataTransformer createDataTransformer(String typeOfDataTransformer) throws DataTransformerCreationException {
		try {
			return (DataTransformer) jclObjectFactory.create(jarClassLoader, typeOfDataTransformer);
		} catch (JclException jclException) {
			throw new DataTransformerCreationException(jclException.getLocalizedMessage());
		}
	}
}
