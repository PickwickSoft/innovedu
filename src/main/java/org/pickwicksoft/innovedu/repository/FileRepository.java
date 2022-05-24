package org.pickwicksoft.innovedu.repository;

import java.util.List;
import java.util.Optional;
import org.pickwicksoft.innovedu.domain.File;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the File entity.
 */
@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    default Optional<File> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<File> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<File> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct file from File file left join fetch file.project",
        countQuery = "select count(distinct file) from File file"
    )
    Page<File> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct file from File file left join fetch file.project")
    List<File> findAllWithToOneRelationships();

    @Query("select distinct file from File file left join fetch file.project where file.project.id = :id")
    List<File> findAllWithToOneRelationshipsForProject(@Param("id") Long projectId);

    @Query("select file from File file left join fetch file.project where file.id =:id")
    Optional<File> findOneWithToOneRelationships(@Param("id") Long id);
}
