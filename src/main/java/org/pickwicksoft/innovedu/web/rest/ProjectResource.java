package org.pickwicksoft.innovedu.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.pickwicksoft.innovedu.domain.Project;
import org.pickwicksoft.innovedu.repository.ProjectRepository;
import org.pickwicksoft.innovedu.repository.UserRepository;
import org.pickwicksoft.innovedu.service.assign.FileDeassigner;
import org.pickwicksoft.innovedu.service.assign.StarDeleter;
import org.pickwicksoft.innovedu.service.assign.UserOperations;
import org.pickwicksoft.innovedu.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.pickwicksoft.innovedu.domain.Project}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "project";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final FileDeassigner fileDeassigner;

    private final UserOperations userOperations;

    private final StarDeleter starDeleter;

    public ProjectResource(
        ProjectRepository projectRepository,
        UserRepository userRepository,
        FileDeassigner fileDeassigner,
        UserOperations userOperations,
        StarDeleter starDeleter
    ) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.fileDeassigner = fileDeassigner;
        this.userOperations = userOperations;
        this.starDeleter = starDeleter;
    }

    /**
     * {@code POST  /projects} : Create a new project.
     *
     * @param project the project to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new project, or with status {@code 400 (Bad Request)} if the project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) throws URISyntaxException {
        log.debug("REST request to save Project : {}", project);
        if (project.getId() != null) {
            throw new BadRequestAlertException("A new project cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userOperations.assignUser(project);
        Project result = projectRepository.save(project);
        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /projects/:id} : Updates an existing project.
     *
     * @param id the id of the project to save.
     * @param project the project to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated project,
     * or with status {@code 400 (Bad Request)} if the project is not valid,
     * or with status {@code 500 (Internal Server Error)} if the project couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody Project project
    ) throws URISyntaxException {
        log.debug("REST request to update Project : {}, {}", id, project);
        if (project.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, project.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        userOperations.assignUser(project);
        Project result = projectRepository.save(project);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, project.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /projects/:id} : Partial updates given fields of an existing project, field will ignore if it is null
     *
     * @param id the id of the project to save.
     * @param project the project to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated project,
     * or with status {@code 400 (Bad Request)} if the project is not valid,
     * or with status {@code 404 (Not Found)} if the project is not found,
     * or with status {@code 500 (Internal Server Error)} if the project couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/projects/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Project> partialUpdateProject(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Project project
    ) throws URISyntaxException {
        log.debug("REST request to partial update Project partially : {}, {}", id, project);
        if (project.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, project.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Project> result = projectRepository
            .findById(project.getId())
            .map(existingProject -> {
                if (project.getTitle() != null) {
                    existingProject.setTitle(project.getTitle());
                }
                if (project.getDescription() != null) {
                    existingProject.setDescription(project.getDescription());
                }
                if (project.getApproved() != null) {
                    existingProject.setApproved(project.getApproved());
                }
                if (project.getDate() != null) {
                    existingProject.setDate(project.getDate());
                }

                return existingProject;
            })
            .map(projectRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, project.getId().toString())
        );
    }

    /**
     * {@code GET  /projects} : get all the projects.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param search the search string to search for in title and descriptions
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projects in body.
     */
    @GetMapping("/projects")
    @Transactional(propagation = Propagation.NEVER)
    public ResponseEntity<List<Project>> getAllProjects(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload,
        @RequestParam(required = false, defaultValue = "") String search
    ) {
        log.debug("REST request to get a page of Projects");
        Page<Project> page;
        if (eagerload) {
            page = projectRepository.findAllByTitleOrDescriptionContainingIgnoreCaseWithEagerRelationships(search, pageable);
        } else {
            page = projectRepository.findAllByTitleOrDescriptionContainingIgnoreCase(search, pageable);
        }
        userOperations.hideUsersIfNecessary(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /projects} : get all the projects.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param search the search string to search for in title and descriptions
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projects in body.
     */
    @GetMapping("/projects/approved")
    @Transactional(propagation = Propagation.NEVER)
    public ResponseEntity<List<Project>> getAllApprovedProjects(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload,
        @RequestParam(required = false, defaultValue = "") String search
    ) {
        log.debug("REST request to get a page of Projects");
        Page<Project> page;
        if (eagerload) {
            page = projectRepository.findAllByTitleOrDescriptionContainingIgnoreCaseAndApprovedWithEagerRelationships(search, pageable);
        } else {
            page = projectRepository.findAllByTitleOrDescriptionContainingIgnoreCaseAndAndApproved(search, pageable);
        }
        userOperations.hideUsersIfNecessary(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /projects/user} : get all the projects of current user.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projects in body.
     */
    @GetMapping("/projects/user")
    public ResponseEntity<List<Project>> getAllProjectsOfUser(
        @RequestParam(required = false, defaultValue = "true") boolean eagerload,
        @RequestParam(required = false, defaultValue = "") String search
    ) {
        log.debug("REST request to get all Projects from current user");
        List<Project> projects;
        if (eagerload) {
            projects = projectRepository.findAllWithEagerRelationshipsOfCurrentUser(search);
        } else {
            projects = projectRepository.findByUserIsCurrentUserPageable(search);
        }
        return ResponseEntity.ok().body(projects);
    }

    /**
     * {@code GET  /projects/user} : get a page of projects except current user.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projects in body.
     */
    @GetMapping("/projects/excludeUser")
    public ResponseEntity<List<Project>> getAllProjectsExceptOfUser(
        @RequestParam(required = false, defaultValue = "true") boolean eagerload,
        @RequestParam(required = false, defaultValue = "") String search
    ) {
        log.debug("REST request to get a page of Projects except from current user");
        List<Project> projects;
        if (eagerload) {
            projects = projectRepository.findAllWithEagerRelationshipsExceptCurrentUser(search);
        } else {
            projects = projectRepository.findByUserIsNotCurrentUserPageable(search);
        }
        return ResponseEntity.ok().body(projects);
    }

    /**
     * {@code GET  /projects/:id} : get the "id" project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{id}")
    public ResponseEntity<Project> getProject(@PathVariable UUID id) {
        log.debug("REST request to get Project : {}", id);
        Optional<Project> project = projectRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(project);
    }

    /**
     * {@code DELETE  /projects/:id} : delete the "id" project.
     *
     * @param id the id of the project to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        log.debug("REST request to delete Project : {}", id);
        fileDeassigner.deassignFilesByProjectId(id);
        starDeleter.deleteStarsByProjectId(id);
        projectRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
