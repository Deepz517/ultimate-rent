package com.rentroll.services.user;

import com.rentroll.core.user.User;

public interface UserService {
    User createUser(User user);
    User findByUsername(String username);
}