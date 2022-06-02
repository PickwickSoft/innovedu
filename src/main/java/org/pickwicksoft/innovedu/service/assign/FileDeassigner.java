package org.pickwicksoft.innovedu.service.assign;

import java.util.List;
import org.pickwicksoft.innovedu.domain.File;
import org.pickwicksoft.innovedu.repository.FileRepository;
import org.springframework.stereotype.Service;

@Service
public class FileDeassigner {

    private final FileRepository fileRepository;

    public FileDeassigner(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public void deassignFilesByProjectId(Long projectId) {
        List<File> files = fileRepository.findAllWithToOneRelationshipsForProject(projectId);
        for (File file : files) {
            file.setProject(null);
            fileRepository.save(file);
        }
    }
}
