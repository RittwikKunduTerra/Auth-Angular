import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
   profileData: any;

  constructor(private authService: AuthService, private router: Router) {}
 ngOnInit() {
    this.authService.getProfile().subscribe(
      (response: any) => {
        console.log(response,"resoonse")
        this.profileData = response;
      },
      (error) => {
        console.error('Failed to fetch profile data:', error);
      }
    );
  }
  logout(){
    localStorage.removeItem('accessToken');
    this.router.navigateByUrl('/login');
  }
}
