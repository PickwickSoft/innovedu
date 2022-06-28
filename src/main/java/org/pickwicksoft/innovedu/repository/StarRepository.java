package org.pickwicksoft.innovedu.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.pickwicksoft.innovedu.domain.Star;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StarRepository extends JpaRepository<Star, Long> {
    Optional<Star> findOneByProjectIdAndUserLogin(UUID projectId, String userLogin);

    List<Star> findStarsByProjectId(UUID projectId);
}
