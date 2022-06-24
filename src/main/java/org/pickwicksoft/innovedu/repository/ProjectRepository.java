package org.pickwicksoft.innovedu.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("select project from Project project where project.user.login = ?#{principal.preferredUsername}")
    List<Project> findByUserIsCurrentUser();

    @Query(
        "select project from Project project where project.user.login = ?#{principal.preferredUsername} and (upper(project.title) like upper(concat('%', :text, '%')) or upper(project.description) like upper(concat('%', :text, '%')))"
    )
    List<Project> findByUserIsCurrentUserPageable(@Param("text") String text);

    default Optional<Project> findOneWithEagerRelationships(UUID id) {
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
        "select p from Project p where (upper(p.title) like upper(concat('%', :text, '%')) or upper(p.description) like upper(concat('%', :text, '%'))) and p.approved = true"
    )
    Page<Project> findAllByTitleOrDescriptionContainingIgnoreCaseAndAndApproved(@Param("text") String text, Pageable pageable);

    @Query(
        value = "select distinct project from Project project left join fetch project.user left join fetch project.topic where upper(project.title) like upper(concat('%', :text, '%')) or upper(project.description) like upper(concat('%', :text, '%'))",
        countQuery = "select count(distinct project) from Project project"
    )
    Page<Project> findAllByTitleOrDescriptionContainingIgnoreCaseWithEagerRelationships(@Param("text") String text, Pageable pageable);

    @Query(
        value = "select distinct project from Project project left join fetch project.user left join fetch project.topic where (upper(project.title) like upper(concat('%', :text, '%')) or upper(project.description) like upper(concat('%', :text, '%'))) and project.approved = true",
        countQuery = "select count(distinct project) from Project project"
    )
    Page<Project> findAllByTitleOrDescriptionContainingIgnoreCaseAndApprovedWithEagerRelationships(
        @Param("text") String text,
        Pageable pageable
    );

    @Query("select project from Project project left join fetch project.user left join fetch project.topic where project.id =:id")
    Optional<Project> findOneWithToOneRelationships(@Param("id") UUID id);

    @Query(
        value = "select distinct project from Project project left join fetch project.user left join fetch project.topic where project.user.login = ?#{principal.preferredUsername} and (upper(project.title) like upper(concat('%', :text, '%')) or upper(project.description) like upper(concat('%', :text, '%')))",
        countQuery = "select count(distinct project) from Project project"
    )
    List<Project> findAllWithEagerRelationshipsOfCurrentUser(@Param("text") String text);

    @Query(
        value = "select distinct project from Project project left join fetch project.user left join fetch project.topic where project.user.login <> ?#{principal.preferredUsername} and (upper(project.title) like upper(concat('%', :text, '%')) or upper(project.description) like upper(concat('%', :text, '%'))) and project.approved = true",
        countQuery = "select count(distinct project) from Project project"
    )
    List<Project> findAllWithEagerRelationshipsExceptCurrentUser(@Param("text") String text);

    @Query(
        "select project from Project project where project.user.login <> ?#{principal.preferredUsername} and (upper(project.title) like upper(concat('%', :text, '%')) or upper(project.description) like upper(concat('%', :text, '%'))) and project.approved = true"
    )
    List<Project> findByUserIsNotCurrentUserPageable(@Param("text") String text);
}
