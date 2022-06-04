package org.pickwicksoft.innovedu.repository;

import java.util.List;
import java.util.Optional;
import org.pickwicksoft.innovedu.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Project entity.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("select project from Project project where project.user.login = ?#{principal.preferredUsername}")
    List<Project> findByUserIsCurrentUser();

    @Query("select project from Project project where project.user.login = ?#{principal.preferredUsername}")
    Page<Project> findByUserIsCurrentUserPageable(Pageable pageable);

    default Optional<Project> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Project> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Project> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct project from Project project left join fetch project.user left join fetch project.topic",
        countQuery = "select count(distinct project) from Project project"
    )
    Page<Project> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct project from Project project left join fetch project.user left join fetch project.topic")
    List<Project> findAllWithToOneRelationships();

    @Query(
        "select p from Project p where upper(p.title) like upper(concat('%', :text, '%')) or upper(p.description) like upper(concat('%', :text, '%'))"
    )
    Page<Project> findAllByTitleOrDescriptionContainingIgnoreCase(@Param("text") String text, Pageable pageable);

    @Query(
        value = "select distinct p from Project p left join fetch p.user left join fetch p.topic where upper(p.title) like upper(concat('%', :text, '%')) or upper(p.description) like upper(concat('%', :text, '%'))",
        countQuery = "select count(distinct project) from Project project"
    )
    Page<Project> findAllByTitleOrDescriptionContainingIgnoreCaseWithEagerRelationships(@Param("text") String text, Pageable pageable);

    @Query("select project from Project project left join fetch project.user left join fetch project.topic where project.id =:id")
    Optional<Project> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(
        value = "select distinct project from Project project left join fetch project.user left join fetch project.topic where project.user.login = ?#{principal.preferredUsername}",
        countQuery = "select count(distinct project) from Project project"
    )
    Page<Project> findAllWithEagerRelationshipsOfCurrentUser(Pageable pageable);
}
