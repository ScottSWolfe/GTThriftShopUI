import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AccountService} from '../../services/account.service';
import {AdminService} from '../../services/admin.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalContentComponent} from '../modal-content/modal-content.component';
import {Router} from '@angular/router';



@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit {

  private isAdmin = false;

  constructor(private accountService: AccountService, private modalService: NgbModal, private router: Router,
              private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.isAdmin().subscribe(res => {
      this.isAdmin = res;
    });
  }

  private logout(): void {
    this.accountService.logout();
  }

  private goToSupport() {
    this.router.navigate(['/support']);
  }

  private admin(): void {
    const content: NgbModalRef = this.modalService.open(ModalContentComponent);
    content.componentInstance.title = 'You\'re an Admin!';
    content.componentInstance.message = 'Look at you, being an admin.';
  }

  private settings(): void {
    const content: NgbModalRef = this.modalService.open(ModalContentComponent);
    content.componentInstance.title = 'Not Implemented';
    content.componentInstance.message = 'This feature has not been implemented';
  }

}
