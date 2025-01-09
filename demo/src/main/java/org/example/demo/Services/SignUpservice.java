package org.example.demo.Services;

import org.example.demo.Model.Admin;
import org.example.demo.Repo.Repoadmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SignUpservice {
    @Autowired
    private Repoadmin adminRepository;

    public Admin registerAdmin(Admin admin){
        return adminRepository.save(admin);
    }
    public Optional<Admin> loginUser(String email, String password) {
        Optional<Admin> admin = Optional.ofNullable(adminRepository.findByEmail(email));
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return admin;
        }
        return Optional.empty();
    }
}
