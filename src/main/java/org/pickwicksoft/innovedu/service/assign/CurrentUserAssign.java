package org.pickwicksoft.innovedu.service.assign;

import org.pickwicksoft.innovedu.domain.UserAssignable;
import org.pickwicksoft.innovedu.repository.UserRepository;
import org.pickwicksoft.innovedu.security.SecurityUtils;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserAssign {

    private final UserRepository userRepository;

    public CurrentUserAssign(UserRepository userRepository) {
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
}
