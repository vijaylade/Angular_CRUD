import { Component } from '@angular/core';
import { UserdataService, User } from './services/userdata.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, NgxDatatableModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'crud-operations';

  isEditMode: boolean = false; // To toggle between Add and Edit modes
  currentUser: User = { id: 0, name: '', email: '' }; // Use User type for currentUser

  users: User[] = []; // Use array of User type for users

  constructor(private userdata: UserdataService) {
    this.loadUsers(); // Load the initial list of users
  }

  // Load all users
  loadUsers(): void {
    this.userdata.getUser().subscribe((result) => {
      this.users = result; // Assign result to users array
      console.log('Users loaded:', this.users);
    });
  }

// Open modal for adding a user
openAddModal(): void {
  this.isEditMode = false;
  const newId = this.users.length > 0 ? Math.max(...this.users.map(user => Number(user.id))) + 1 : 1;
  console.log(newId);
  //check id datatype
  console.log('User IDs:', this.users.map(user => typeof user.id));

  this.currentUser = { id: newId, name: '', email: '' }; // Reset form for adding user
}


  // Add a new user
  addUser(id: number, name: string, email: string): void {
    const userData: User = { id, name, email }; 

    this.userdata.addUsers(userData).subscribe(
      (result) => {
        console.log('User added successfully:', result);

        Swal.fire({
          toast: true, 
          position: 'top-end',
          title: 'Success!',
          text: 'User added successfully!',
          icon: 'success',
          showConfirmButton: false, 
          timer: 3000, 
          timerProgressBar: true,
        });

        this.loadUsers(); 
        this.currentUser = { name: '', email: '' }; // Reset form
      }
      
    );
  }

  // Open modal for editing a user
  openEditModal(user: User): void {
    this.isEditMode = true;
    this.currentUser = { ...user }; // Populate form with selected user data
  }

  // Update a user
  updateUser(): void {
    if (this.currentUser.id) {
      this.userdata.editUser(this.currentUser.id, this.currentUser).subscribe(() => {
        console.log('User updated successfully');
        
        Swal.fire({
          toast: true, 
          position: 'top-end',
          title: 'Success!',
          text: 'User updated successfully!',
          icon: 'success',
          showConfirmButton: false, 
          timer: 3000, 
          timerProgressBar: true,
        });

        this.loadUsers();
      });
    }
  }

  // Delete a user
  deleteUser(id: number): void {
    if (id) {

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this user? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
      }).then((result)=> {
        if (result.isConfirmed) {
          this.userdata.deleteUser(id).subscribe(() => {
            console.log('User Deleted successfully:', id);

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'User deleted successfully!',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            this.loadUsers(); 
            
          });

        }
      })
    
    }
  }
}
