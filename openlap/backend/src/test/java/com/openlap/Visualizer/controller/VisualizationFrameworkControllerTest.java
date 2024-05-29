package com.openlap.Visualizer.controller;
import com.openlap.Visualizer.dtos.response.UploadVisualizationLibraryResponse;
import com.openlap.Visualizer.exceptions.VisualizationLibraryDeletionException;
import com.openlap.Visualizer.exceptions.VisualizationLibraryUploadException;
import com.openlap.Visualizer.exceptions.VisualizationTypeDeletionException;
import com.openlap.Visualizer.service.VisualizationFrameworkService;
import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class VisualizationFrameworkControllerTest {
    @InjectMocks
    private VisualizationFrameworkController controllerClass;
    @Mock
    private VisualizationFrameworkService visualizationFrameworkService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void uploadNewVisualizationLibrary_uploadCorrectlyImplementedJarFile_returnsSuccess() {
        MultipartFile mockFile = mock(MultipartFile.class);

        // Mock external methods
        doNothing().when(visualizationFrameworkService).uploadVisualizationLibraries(mockFile);

        // Act
        UploadVisualizationLibraryResponse response = controllerClass.uploadNewVisualizationLibrary(mockFile);

        // Assert
        assertEquals(true, response.getSuccess());

        // Verify that the service method was called
        verify(visualizationFrameworkService, times(1)).uploadVisualizationLibraries(mockFile);
    }

    @Test
    public void uploadNewVisualizationLibrary_uploadIncorrectlyImplementedJarFile_throwException() {
        MultipartFile mockFile = mock(MultipartFile.class);
        doThrow(new VisualizationLibraryUploadException("Error message")).when(visualizationFrameworkService).uploadVisualizationLibraries(mockFile);

        // Act and Assert
        try {
            controllerClass.uploadNewVisualizationLibrary(mockFile);
        } catch (VisualizationLibraryUploadException exception) {
            assertEquals("Error message", exception.getMessage());
        }

        // Verify that the service method was called
        verify(visualizationFrameworkService, times(1)).uploadVisualizationLibraries(mockFile);
    }

    @Test
    public void deleteVisualizationLibrary_correctId_returnSuccess() {
        // Arrange
        String vizLibraryId = "123";
        doNothing().when(visualizationFrameworkService).deleteVisualizationLibrary(vizLibraryId);  // Mock external methods

        // Act
        ResponseEntity<String> response = controllerClass.deleteVisualizationLibrary(vizLibraryId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(visualizationFrameworkService, times(1)).deleteVisualizationLibrary(vizLibraryId); //Verify that the service method was called
    }

    @Test
    public void deleteVisualizationLibrary_incorrectId_throwException(){
        // Arrange
        String vizLibraryId = "123";
        doThrow(new VisualizationLibraryDeletionException("Error message")).when(visualizationFrameworkService).deleteVisualizationLibrary(vizLibraryId);

        // Act
        try{
            controllerClass.deleteVisualizationLibrary(vizLibraryId);
        }catch (VisualizationLibraryDeletionException e){
            assertEquals("Error message", e.getMessage());
        }

        verify(visualizationFrameworkService, times(1)).deleteVisualizationLibrary(vizLibraryId);
    }

    @Test
    public void deleteVisualizationType_correctId_returnSuccess() {
        // Arrange
        String vizLibraryId = "123";
        doNothing().when(visualizationFrameworkService).deleteVisualizationType(vizLibraryId);  // Mock external methods

        // Act
        ResponseEntity<String> response = controllerClass.deleteVisualizationLibrary(vizLibraryId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(visualizationFrameworkService, times(1)).deleteVisualizationLibrary(vizLibraryId); //Verify that the service method was called
    }

    @Test
    public void deleteVisualizationType_incorrectId_throwException(){
        // Arrange
        String vizLibraryId = "123";
        doThrow(new VisualizationTypeDeletionException("Error message")).when(visualizationFrameworkService).deleteVisualizationType(vizLibraryId);

        // Act
        try{
            controllerClass.deleteVisualizationType(vizLibraryId);
        }catch (VisualizationTypeDeletionException e){
            assertEquals("Error message", e.getMessage());
        }

        verify(visualizationFrameworkService, times(1)).deleteVisualizationType(vizLibraryId);
    }
}