package org.pickwicksoft.innovedu.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.pickwicksoft.innovedu.domain.Project;
import org.pickwicksoft.innovedu.domain.Star;
import org.pickwicksoft.innovedu.repository.ProjectRepository;
import org.pickwicksoft.innovedu.repository.StarRepository;
import org.pickwicksoft.innovedu.security.SecurityUtils;
import org.pickwicksoft.innovedu.service.assign.UserOperations;
import org.pickwicksoft.innovedu.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Transactional
public class StarResource {

    private final Logger log = LoggerFactory.getLogger(TopicResource.class);

    private static final String ENTITY_NAME = "star";

    private final ProjectRepository projectRepository;

    private final StarRepository starRepository;

    private final UserOperations userOperations;

    public StarResource(StarRepository starRepository, UserOperations userOperations, ProjectRepository projectRepository) {
        this.starRepository = starRepository;
        this.projectRepository = projectRepository;
        this.userOperations = userOperations;
    }

    @GetMapping("/stars")
    public List<Star> getAllStars() {
        log.debug("REST request to get all Stars");
        return starRepository.findAll();
    }

    @GetMapping("/stars/{projectId}")
    public Integer getStar(@PathVariable UUID projectId) {
        log.debug("REST request to get Stars of project : {}", projectId);
        // Check if project with given id exists, else throw BadRequestAlertException
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new BadRequestAlertException("Project with id " + projectId + " does not exist", ENTITY_NAME, "idnotfound");
        }
        List<Star> stars = starRepository.findStarsByProjectId(projectId);
        return stars.size();
    }

    @GetMapping("/stars/isStared/{projectId}")
    public boolean isProjectStarred(@PathVariable UUID projectId) {
        log.debug("REST request to check if project is starred");
        // Check if project with given id exists, else throw BadRequestAlertException
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new BadRequestAlertException("Project with id " + projectId + " does not exist", ENTITY_NAME, "idnotfound");
        }
        return starRepository.findOneByProjectIdAndUserLogin(projectId, SecurityUtils.getCurrentUserLogin().get()).isPresent();
    }

    @PostMapping("/stars/star/{projectId}")
    public ResponseEntity<Star> createStar(@PathVariable UUID projectId) throws URISyntaxException {
        log.debug("REST request to star project: {}", projectId);
        var project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new BadRequestAlertException("Invalid project id", ENTITY_NAME, "invalidid");
        }
        // Check if star already associated with user, else create new star
        var isStarred = starRepository.findOneByProjectIdAndUserLogin(projectId, SecurityUtils.getCurrentUserLogin().get());
        if (isStarred.isPresent()) {
            throw new BadRequestAlertException("Project already starred", ENTITY_NAME, "alreadystarred");
        }
        var star = new Star();
        star.setProject(project.get());
        userOperations.assignUser(star);
        Star result = starRepository.save(star);
        return ResponseEntity.created(new URI("/api/stars/" + result.getId())).body(result);
    }

    @DeleteMapping("/stars/unstar/{projectId}")
    public ResponseEntity<Void> deleteStar(@PathVariable UUID projectId) throws URISyntaxException {
        log.debug("REST request to unstar project: {}", projectId);
        var project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new BadRequestAlertException("Invalid project id", ENTITY_NAME, "invalidid");
        }
        // Check if star already associated with user, else create new star
        var isStarred = starRepository.findOneByProjectIdAndUserLogin(projectId, SecurityUtils.getCurrentUserLogin().get());
        if (!isStarred.isPresent()) {
            throw new BadRequestAlertException("Project not starred", ENTITY_NAME, "notstarred");
        }
        starRepository.delete(isStarred.get());
        return ResponseEntity.ok().build();
    }
}
