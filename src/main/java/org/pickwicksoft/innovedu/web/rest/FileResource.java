package org.pickwicksoft.innovedu.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.pickwicksoft.innovedu.domain.File;
import org.pickwicksoft.innovedu.repository.FileRepository;
import org.pickwicksoft.innovedu.service.assign.CurrentUserAssign;
import org.pickwicksoft.innovedu.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.pickwicksoft.innovedu.domain.File}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FileResource {

    private final Logger log = LoggerFactory.getLogger(FileResource.class);

    private static final String ENTITY_NAME = "file";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileRepository fileRepository;

    private final CurrentUserAssign currentUserAssign;

    public FileResource(FileRepository fileRepository, CurrentUserAssign currentUserAssign) {
        this.fileRepository = fileRepository;
        this.currentUserAssign = currentUserAssign;
    }

    /**
     * {@code POST  /files} : Create a new file.
     *
     * @param file the file to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new file, or with status {@code 400 (Bad Request)} if the file has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/files")
    public ResponseEntity<File> createFile(@Valid @RequestBody File file) throws URISyntaxException {
        log.debug("REST request to save File : {}", file);
        if (file.getId() != null) {
            throw new BadRequestAlertException("A new file cannot already have an ID", ENTITY_NAME, "idexists");
        }
        currentUserAssign.assignUser(file);
        File result = fileRepository.save(file);
        return ResponseEntity
            .created(new URI("/api/files/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /files/:id} : Updates an existing file.
     *
     * @param id the id of the file to save.
     * @param file the file to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated file,
     * or with status {@code 400 (Bad Request)} if the file is not valid,
     * or with status {@code 500 (Internal Server Error)} if the file couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/files/{id}")
    public ResponseEntity<File> updateFile(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody File file)
        throws URISyntaxException {
        log.debug("REST request to update File : {}, {}", id, file);
        if (file.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, file.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        currentUserAssign.assignUser(file);
        File result = fileRepository.save(file);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, file.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /files/:id} : Partial updates given fields of an existing file, field will ignore if it is null
     *
     * @param id the id of the file to save.
     * @param file the file to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated file,
     * or with status {@code 400 (Bad Request)} if the file is not valid,
     * or with status {@code 404 (Not Found)} if the file is not found,
     * or with status {@code 500 (Internal Server Error)} if the file couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/files/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<File> partialUpdateFile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody File file
    ) throws URISyntaxException {
        log.debug("REST request to partial update File partially : {}, {}", id, file);
        if (file.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, file.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<File> result = fileRepository
            .findById(file.getId())
            .map(existingFile -> {
                if (file.getData() != null) {
                    existingFile.setData(file.getData());
                }
                if (file.getDataContentType() != null) {
                    existingFile.setDataContentType(file.getDataContentType());
                }
                if (file.getName() != null) {
                    existingFile.setName(file.getName());
                }

                return existingFile;
            })
            .map(fileRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, file.getId().toString())
        );
    }

    /**
     * {@code GET  /files} : get all the files.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of files in body.
     */
    @GetMapping("/files")
    public List<File> getAllFiles(
        @RequestParam(required = false, defaultValue = "false") boolean eagerload,
        @RequestParam(required = false, defaultValue = "-1") Long projectId
    ) {
        log.debug("REST request to get all Files");
        if (projectId != -1) {
            return fileRepository.findAllWithToOneRelationshipsForProject(projectId);
        }
        return fileRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /files/:id} : get the "id" file.
     *
     * @param id the id of the file to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the file, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/files/{id}")
    public ResponseEntity<File> getFile(@PathVariable Long id) {
        log.debug("REST request to get File : {}", id);
        Optional<File> file = fileRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(file);
    }

    /**
     * {@code DELETE  /files/:id} : delete the "id" file.
     *
     * @param id the id of the file to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/files/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        log.debug("REST request to delete File : {}", id);
        fileRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
