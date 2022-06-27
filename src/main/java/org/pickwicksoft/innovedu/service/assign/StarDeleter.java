package org.pickwicksoft.innovedu.service.assign;

import java.util.List;
import java.util.UUID;
import org.pickwicksoft.innovedu.domain.Star;
import org.pickwicksoft.innovedu.repository.StarRepository;
import org.springframework.stereotype.Service;

// This class deletes all Stars from star repository, assigned to given project UUID.
@Service
public class StarDeleter {

    private final StarRepository starRepository;

    public StarDeleter(StarRepository starRepository) {
        this.starRepository = starRepository;
    }

    public void deleteStarsByProjectId(UUID projectId) {
        List<Star> stars = starRepository.findStarsByProjectId(projectId);
        for (Star star : stars) {
            starRepository.delete(star);
        }
    }
}
