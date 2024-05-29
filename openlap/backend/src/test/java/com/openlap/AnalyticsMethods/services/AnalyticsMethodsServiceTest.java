package com.openlap.AnalyticsMethods.services;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsUploadErrorException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import java.util.*;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.springframework.web.multipart.MultipartFile;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.transaction.TransactionManager;
import java.util.List;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import static org.powermock.api.mockito.PowerMockito.*;
import static org.junit.Assert.fail;

@RunWith(PowerMockRunner.class)
@PrepareForTest({AnalyticsMethodsService.class, com.arjuna.ats.jta.TransactionManager.class, Persistence.class})
@PowerMockIgnore({"javax.management.", "com.sun.org.apache.xerces.",
        "javax.xml.", "org.xml.", "org.w3c.dom.",
        "com.sun.org.apache.xalan.", "javax.activation.*"})
public class AnalyticsMethodsServiceTest {
    private static final String JAR_EXTENSION = ".jar";
    AnalyticsMethodsService analyticsMethodsService;
    String folderName;
    MultipartFile jarFile;
    List<AnalyticsMethods> analyticsMethodsGeneratedFromJarFile;
    EntityManager emMock;
    @Before
    public void setUp() throws Exception {
        mockStatic(com.arjuna.ats.jta.TransactionManager.class);
        mockStatic(Persistence.class);

        // Create mock objects for dependencies
        TransactionManager mockTransactionManager = mock(TransactionManager.class);
        EntityManagerFactory mockEntityManagerFactory = mock(EntityManagerFactory.class);
        emMock = mock(EntityManager.class);

        // Stub static method calls
        when(com.arjuna.ats.jta.TransactionManager.transactionManager()).thenReturn(mockTransactionManager);
        when(Persistence.createEntityManagerFactory("OpenLAP")).thenReturn(mockEntityManagerFactory);
        when(mockEntityManagerFactory.createEntityManager()).thenReturn(emMock);

        // Objects and mocks for the test
        analyticsMethodsService =  PowerMockito.spy(new AnalyticsMethodsService());
        folderName = "folderName";
        jarFile = mock(MultipartFile.class);
        analyticsMethodsGeneratedFromJarFile = new ArrayList<>();
    }

    @Test
    public void uploadAnalyticsMethod_UploadsJarFileWithIncorrectlyImplementedContent_Throwsxception() throws Exception {
        // Arrange
        PowerMockito.doReturn(folderName)
                .when(analyticsMethodsService, "saveJarFile", jarFile);

        when(analyticsMethodsService, method(AnalyticsMethodsService.class,
                            "generateMethodsFromJarFile",
                                        String.class))
                    .withArguments(null + folderName + JAR_EXTENSION)
                    .thenReturn(analyticsMethodsGeneratedFromJarFile);

        // Act and assert
        try {
            this.analyticsMethodsService.uploadAnalyticsMethod(jarFile);
        } catch (AnalyticsMethodsBadRequestException exception) {
            Assert.assertTrue(exception.getMessage().contains("Incorrect GroupId was set in the project or no class extends AnalyticsMethod class."));
        }
    }

    @Test
    public void uploadAnalyticsMethod_uploadsJarFileWithInvalidAnalyticsMethod_ThrowsException() throws Exception {
        // Arrange
        analyticsMethodsGeneratedFromJarFile.add(new AnalyticsMethods());

        PowerMockito.doReturn(folderName)
                .when(analyticsMethodsService, "saveJarFile", jarFile);

        when(analyticsMethodsService, method(AnalyticsMethodsService.class, "generateMethodsFromJarFile", String.class))
                .withArguments(null + folderName + JAR_EXTENSION)
                .thenReturn(analyticsMethodsGeneratedFromJarFile);

        PowerMockito.doThrow(new AnalyticsMethodsUploadErrorException("is probably not correctly defined."))
                .when(analyticsMethodsService, "validateMethodAndDeleteJarIfInvalid",
                        analyticsMethodsGeneratedFromJarFile.get(0), folderName);

        // Act and assert
        try {
            this.analyticsMethodsService.uploadAnalyticsMethod(jarFile);
        } catch (AnalyticsMethodsBadRequestException exception) {
            Assert.assertTrue(exception.getMessage().contains("is probably not correctly defined."));
        }
    }

    @Test
    public void uploadAnalyticsMethod_UploadsJarFileWithMethodExistingInDatabase_ThrowsException() throws Exception {
        // Arrange
        analyticsMethodsGeneratedFromJarFile.add(new AnalyticsMethods());

        PowerMockito.doReturn(folderName)
                .when(analyticsMethodsService, "saveJarFile", jarFile);

        when(analyticsMethodsService, method(AnalyticsMethodsService.class, "generateMethodsFromJarFile", String.class))
                .withArguments(null + folderName + JAR_EXTENSION)
                .thenReturn(analyticsMethodsGeneratedFromJarFile);

        PowerMockito.doNothing()
                .when(analyticsMethodsService, "validateMethodAndDeleteJarIfInvalid",
                        analyticsMethodsGeneratedFromJarFile.get(0), folderName);

        PowerMockito.doReturn(analyticsMethodsGeneratedFromJarFile)
                .when(analyticsMethodsService, "getAllAnalyticsMethodsFromDatabase");

        // Act and assert
        try {
            this.analyticsMethodsService.uploadAnalyticsMethod(jarFile);
        } catch (AnalyticsMethodsBadRequestException exception) {
            Assert.assertTrue(exception.getMessage().contains("exists already in the database."));
        }
    }

    @Test
    public void uploadAnalyticsMethod_UploadsJarFileWithCorrectContent_ThrowsNoException() throws Exception {
        // Arrange
        var analyticsMethodFromJarFile = new AnalyticsMethods();
        analyticsMethodFromJarFile.setName("analytics method from jar file");
        analyticsMethodsGeneratedFromJarFile.add(analyticsMethodFromJarFile);

        var analyticsMethodFromDatabase = new AnalyticsMethods();
        analyticsMethodFromJarFile.setName("analytics method from database");
        var analyticsMethodsFromDatabase = List.of(analyticsMethodFromDatabase);

        PowerMockito.doReturn(folderName)
                .when(analyticsMethodsService, "saveJarFile", jarFile);

        when(analyticsMethodsService, method(AnalyticsMethodsService.class, "generateMethodsFromJarFile", String.class))
                .withArguments(null + folderName + JAR_EXTENSION)
                .thenReturn(analyticsMethodsGeneratedFromJarFile);

        PowerMockito.doNothing()
                .when(analyticsMethodsService, "validateMethodAndDeleteJarIfInvalid",
                        analyticsMethodsGeneratedFromJarFile.get(0), folderName);

        PowerMockito.doReturn(analyticsMethodsFromDatabase)
                .when(analyticsMethodsService, "getAllAnalyticsMethodsFromDatabase");

        // Act and assert
        try {
            this.analyticsMethodsService.uploadAnalyticsMethod(jarFile);
        } catch (AnalyticsMethodsBadRequestException exception) {
            fail("Expected no exception to be thrown, but caught AnalyticsMethodsBadRequestException: " + exception.getMessage());
        }
    }

    @Test
    public void deleteAnalyticsMethodTogetherWithItsJarFile_IncorrectIdPassedAsInput_ThrowsException() throws Exception {
        // Arrange
        EntityTransaction transactionMock = PowerMockito.mock(EntityTransaction.class);

        PowerMockito.doNothing()
                .when(transactionMock, "begin");
        PowerMockito.doReturn(transactionMock)
                .when(emMock, "getTransaction");

        // Act and assert
        try {
            this.analyticsMethodsService.deleteMethodWithJar("incorrect id");
        } catch (AnalyticsMethodsBadRequestException exception) {
            Assert.assertTrue(exception.getMessage().contains("not found."));
        }
    }

    @Test
    public void deleteAnalyticsMethodTogetherWithItsJarFile_DoesNotDeleteJarFile_FollowingMethodIsNotInvokedDeleteSavedJarFileWithNameThatHasJarExtensionAtTheEnd()
            throws Exception {
        // Arrange
        String idToDelete = "some id";

        // mocking the return value of em.getTransaction()
        EntityTransaction transactionMock = PowerMockito.mock(EntityTransaction.class);

        String jarFileName = "file name";

        var analyticsMethodFoundBasedOnId = new AnalyticsMethods();
        analyticsMethodFoundBasedOnId.setFilename(jarFileName);

        var anotherAnalyticsMethodFromDatabaseWithSameFileName = new AnalyticsMethods();
        anotherAnalyticsMethodFromDatabaseWithSameFileName.setFilename(jarFileName);
        var analyticsMethodsFromDatabase = List.of(anotherAnalyticsMethodFromDatabaseWithSameFileName);

        PowerMockito.doReturn(transactionMock)
                .when(emMock, "getTransaction");
        PowerMockito.doReturn(analyticsMethodFoundBasedOnId)
                .when(emMock, "find", AnalyticsMethods.class, idToDelete);
        PowerMockito.doNothing()
                .when(emMock, "remove", analyticsMethodFoundBasedOnId);
        PowerMockito.doReturn(analyticsMethodsFromDatabase)
                .when(analyticsMethodsService, "getAllAnalyticsMethodsFromDatabase");

        // Act
        analyticsMethodsService.deleteMethodWithJar(idToDelete);

        // Assert
        verifyPrivate(analyticsMethodsService, org.mockito.Mockito.never()).
                invoke("deleteSavedJarFileWithNameThatHasJarExtensionAtTheEnd", org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    public void deleteAnalyticsMethodTogetherWithItsJarFile_DeletesJarFile_FollowingMethodIsInvokedDeleteSavedJarFileWithNameThatHasJarExtensionAtTheEnd()
            throws Exception {
        // Arrange
        String idToDelete = "some id";

        // mocking the return value of em.getTransaction()
        EntityTransaction transactionMock = PowerMockito.mock(EntityTransaction.class);

        String jarFileName = "file name";
        var analyticsMethodFoundBasedOnId = new AnalyticsMethods();
        analyticsMethodFoundBasedOnId.setFilename(jarFileName);

        String otherJarFileName = "some other file name";
        var anotherAnalyticsMethodWithSameFileName = new AnalyticsMethods();
        anotherAnalyticsMethodWithSameFileName.setFilename(otherJarFileName);
        var analyticsMethodsFromDatabase = List.of(anotherAnalyticsMethodWithSameFileName);

        PowerMockito.doReturn(transactionMock)
                .when(emMock, "getTransaction");
        PowerMockito.doReturn(analyticsMethodFoundBasedOnId)
                .when(emMock, "find", AnalyticsMethods.class, idToDelete);
        PowerMockito.doNothing()
                .when(emMock, "remove", analyticsMethodFoundBasedOnId);
        PowerMockito.doReturn(analyticsMethodsFromDatabase)
                .when(analyticsMethodsService, "getAllAnalyticsMethodsFromDatabase");

        // Act
        analyticsMethodsService.deleteMethodWithJar(idToDelete);

        // Assert
        verifyPrivate(analyticsMethodsService).invoke("deleteSavedJarFileWithNameThatHasJarExtensionAtTheEnd", jarFileName);
    }
}