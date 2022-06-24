package org.pickwicksoft.innovedu.service.assign;

import org.pickwicksoft.innovedu.domain.Project;
import org.pickwicksoft.innovedu.domain.UserAssignable;
import org.pickwicksoft.innovedu.repository.UserRepository;
import org.pickwicksoft.innovedu.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class UserOperations {

    private final UserRepository userRepository;

    public UserOperations(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void assignUser(UserAssignable project) {
        if (project.getUser() == null) {
            var currentUserLogin = SecurityUtils.getCurrentUserLogin();
            if (currentUserLogin.isPresent()) {
                var user = userRepository.findOneByLogin(currentUserLogin.get());
                user.ifPresent(project::setUser);
            }
        }
    }

    public boolean isUserLoggedIn() {
        return !SecurityUtils.getCurrentUserLogin().get().equals("anonymousUser");
    }

    public void hideUsersIfNecessary(Page<Project> projects) {
        if (!isUserLoggedIn()) {
            projects.forEach(project -> project.setUser(null));
        }
    }
}
