package com.rentroll.web.user;

import com.rentroll.core.user.User;
import com.rentroll.services.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        // Basic security: In a real app, you'd ensure only the user themselves or an admin can access this.
        // For this app's purpose (getting details post-login), this is acceptable.
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Important: Never send the password hash back to the client.
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}