package com.openlap.AnalyticsMethods.controller;
import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import com.openlap.AnalyticsMethods.services.AnalyticsMethodsService;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class AnalyticsMethodsControllerTest {
    @InjectMocks
    private AnalyticsMethodsController controllerClass;
    @Mock
    private AnalyticsMethodsService analyticsMethodsService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void uploadAnalyticsMethod_uploadCorrectlyImplementedJarFile_returnsSuccess() {
        // ARRANGE
        MultipartFile mockFile = mock(MultipartFile.class);
        // Mock external methods
        doNothing().when(analyticsMethodsService).uploadAnalyticsMethod(mockFile);

        // ACT
        ResponseEntity<String> response = controllerClass.uploadAnalyticsMethod(mockFile);

        // ASSERT
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Operation successful!", response.getBody());
        // Verify that the service method was called
        verify(analyticsMethodsService, times(1)).uploadAnalyticsMethod(mockFile);
    }

    @Test
    public void uploadAnalyticsMethod_uploadIncorrectlyImplementedJarFile_returnsError() {
        // Arrange
        MultipartFile mockFile = mock(MultipartFile.class);
        doThrow(new AnalyticsMethodsBadRequestException("Error message")).when(analyticsMethodsService).uploadAnalyticsMethod(mockFile);

        // Act and Assert
        try {
            controllerClass.uploadAnalyticsMethod(mockFile);
        } catch (AnalyticsMethodsBadRequestException exception) {
            assertEquals("Error message", exception.getMessage());
        }

        // Verify that the service method was called
        verify(analyticsMethodsService, times(1)).uploadAnalyticsMethod(mockFile);
    }

    @Test
    public void updateAnalyticsMethod_returnSuccess() {
        MultipartFile mockFile = mock(MultipartFile.class);

        // Mock external methods
        doNothing().when(analyticsMethodsService).updateAnalyticsMethod(mockFile);

        // Act
        ResponseEntity<String> response = controllerClass.updateAnalyticsMethod(mockFile);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Operation successful!", response.getBody());

        // Verify that the service method was called
        verify(analyticsMethodsService, times(1)).updateAnalyticsMethod(mockFile);
    }

    @Test
    public void updateAnalyticsMethod_throwException() {
        MultipartFile mockFile = mock(MultipartFile.class);

        // Mock external methods to throw an exception
        doThrow(new AnalyticsMethodsBadRequestException("Error message")).when(analyticsMethodsService).updateAnalyticsMethod(mockFile);

        // Act and Assert
        try {
            controllerClass.updateAnalyticsMethod(mockFile);
        } catch (AnalyticsMethodsBadRequestException exception) {
            assertEquals("Error message", exception.getMessage());
        }

        // Verify that the service method was called
        verify(analyticsMethodsService, times(1)).updateAnalyticsMethod(mockFile);
    }

    @Test
    public void deleteAnalyticsMethod_correctId_returnSuccess() {
        String analyticsMethodId = "123";

        // Mock external methods
        doNothing().when(analyticsMethodsService).deleteMethodWithJar(analyticsMethodId);

        // Act
        ResponseEntity<String> response = controllerClass.deleteAnalyticsMethod(analyticsMethodId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Operation successful!", response.getBody());

        // Verify that the service method was called
        verify(analyticsMethodsService, times(1)).deleteMethodWithJar(analyticsMethodId);
    }

    @Test
    public void deleteAnalyticsMethod_incorrectId_throwException() {
        String analyticsMethodId = "456";

        // Mock external methods to throw an exception
        doThrow(new AnalyticsMethodsBadRequestException("Error message")).when(analyticsMethodsService).deleteMethodWithJar(analyticsMethodId);

        // Act and Assert
        try {
            controllerClass.deleteAnalyticsMethod(analyticsMethodId);
        } catch (AnalyticsMethodsBadRequestException exception) {
            assertEquals("Error message", exception.getMessage());
        }

        // Verify that the service method was called
        verify(analyticsMethodsService, times(1)).deleteMethodWithJar(analyticsMethodId);
    }
}