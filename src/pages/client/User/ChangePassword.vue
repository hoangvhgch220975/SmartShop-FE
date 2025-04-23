<template>
    <div class="container mt-5 pt-5">
        <h2 class="text-info font-weight-bold mb-4">🔒 Change Password</h2>
        <form @submit.prevent="submitForm" class="change-password-form">
            <!-- Old Password -->
            <div class="form-group mb-4">
                <label for="oldPassword">Old Password</label>
                <div class="input-group">
                    <input v-model="oldPassword" :type="showOldPassword ? 'text' : 'password'" class="form-control"
                        id="oldPassword" placeholder="Enter your old password" required />
                    <div class="input-group-append">
                        <span @click="togglePasswordVisibility('oldPassword')" class="input-group-text"
                            style="cursor: pointer">
                            <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- New Password -->
            <div class="form-group mb-4">
                <label for="newPassword">New Password</label>
                <div class="input-group">
                    <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" class="form-control"
                        id="newPassword" placeholder="Enter your new password" required />
                    <div class="input-group-append">
                        <span @click="togglePasswordVisibility('newPassword')" class="input-group-text"
                            style="cursor: pointer">
                            <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group mb-4">
                <label for="confirmPassword">Confirm New Password</label>
                <div class="input-group">
                    <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control" id="confirmPassword" placeholder="Confirm your new password" required />
                    <div class="input-group-append">
                        <span @click="togglePasswordVisibility('confirmPassword')" class="input-group-text"
                            style="cursor: pointer">
                            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </span>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Submit</button>
        </form>
    </div>
</template>

<script>
import { changeUserPassword } from "@/api/UserAPI"; // Import the function from the API file

export default {
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            showOldPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
        };
    },
    methods: {
        // Toggle password visibility
        togglePasswordVisibility(field) {
            if (field === 'oldPassword') {
                this.showOldPassword = !this.showOldPassword;
            } else if (field === 'newPassword') {
                this.showNewPassword = !this.showNewPassword;
            } else if (field === 'confirmPassword') {
                this.showConfirmPassword = !this.showConfirmPassword;
            }
        },

        async submitForm() {
            if (this.newPassword !== this.confirmPassword) {
                alert('New passwords do not match.');
                return;
            }

            try {
                const passwordData = {
                    password: this.newPassword, // Pass only the new password
                };

                // Call the API to change the password
                await changeUserPassword(this.$route.params.id, passwordData); // Make sure you're sending the correct user ID

                alert("Password changed successfully.");
                this.$router.push(`/profile/${this.$route.params.id}`); // Redirect to the profile page
            } catch (error) {
                alert("Error changing password: " + error.response?.data?.message || error.message);
            }
        },
    },
};
</script>

<style scoped>
/* Styling for the change password form */
.change-password-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.change-password-form .form-group {
    margin-bottom: 20px;
}

.change-password-form label {
    font-weight: 600;
    color: #333;
}

.change-password-form .form-control {
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: border-color 0.3s ease;
}

.change-password-form .form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

.change-password-form .btn {
    font-size: 1.1rem;
    padding: 12px;
    border-radius: 5px;
    background-color: #28a745;
    color: white;
    border: none;
    transition: background-color 0.3s ease;
}

.change-password-form .btn:hover {
    background-color: #218838;
    cursor: pointer;
}

.change-password-form .btn:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

/* Ensure enough top space for the form */
.container {
    padding-top: 80px;
    /* Add space to ensure form is below the navbar */
}

/* Styling for the eye icon */
.input-group-text {
    cursor: pointer;
}

@media (max-width: 576px) {
    .change-password-form {
        padding: 20px;
    }
}
</style>