import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User} from '../../model/user';
import {ModalService} from '../../services/modal.service';
import {ValidationUtils} from '../../utils/validation.utils';
import {UserService} from '../../services/user.service';
import {ModalBlockUserContentComponent} from '../modal-block-user-content/modal-block-user-content.component';
import {ModalMessagingContentComponent} from '../modal-messaging-content/modal-messaging-content.component';
import {ListingService} from '../../services/listing.service';
import {Listing} from '../../model/listing';
import {ModalEditListingContentComponent} from '../modal-edit-listing-content/modal-edit-listing-content.component';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfilePageComponent implements OnInit {

  private editProfileEnabled = false;
  private user: User;
  private currentUserId = '';

  private firstName: string;
  private lastName: string;
  private profilePictureUrl: string;
  private profileBio: string;

  private listings: Listing[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private accountService: AccountService,
    private modalService: ModalService,
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.accountService.getCurrentUserFromToken()._id;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userService.getUserById(params['id']).subscribe(value => {
        this.user = value;
      }, error => {
        this.router.navigate(['']);
      });
    });
    this.getListingsForCurrentUser();
  }

  private isCurrentUsersProfile(): boolean {
    return this.user && this.user._id === this.currentUserId;
  }

  private editProfile(): void {
    if (!this.isCurrentUsersProfile()) {
      return;
    }
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.profilePictureUrl = this.user.profilePictureUrl;
    this.profileBio = this.user.profileBio;
    this.editProfileEnabled = true;
  }


  private done(): void {
    if (!this.isCurrentUsersProfile()) {
      this.editProfileEnabled = false;
      return;
    }
    this.updateFirstName()
      .then(() => this.updateLastName())
      .then(() => this.updatePictureUrl())
      .then(() => this.updateProfileBio())
      .then(() => this.editProfileEnabled = false)
      .catch(() => this.editProfileEnabled = false);
  }

  private updateFirstName(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!ValidationUtils.validateNotEmpty(this.firstName)) {
        reject();
      } else if (this.firstName === this.user.firstName) {
        resolve();
      } else {
        this.accountService.updateFirstName(this.firstName, msg => {
          if (!msg.successful) {
            this.modalService.openAlertModal('Failed to update first name.', msg.text);
            reject();
          } else {
            this.user.firstName = this.firstName;
            resolve();
          }
        });
      }
    });
  }

  private updateLastName(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!ValidationUtils.validateNotEmpty(this.lastName)) {
        reject();
      } else if (this.lastName === this.user.lastName) {
        resolve();
      } else {
        this.accountService.updateLastName(this.lastName, msg => {
          if (!msg.successful) {
            this.modalService.openAlertModal('Failed to update last name.', msg.text);
            reject();
          } else {
            this.user.lastName = this.lastName;
            resolve();
          }
        });
      }
    });
  }

  private updatePictureUrl(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.profilePictureUrl === this.user.profilePictureUrl) {
        resolve();
      } else {
        this.accountService.updateProfilePictureUrl(this.profilePictureUrl, msg => {
          if (!msg.successful) {
            this.modalService.openAlertModal('Failed to update profile picture.', msg.text);
            reject();
          } else {
            this.user.profilePictureUrl = this.profilePictureUrl;
            resolve();
          }
        });
      }
    });
  }

  private updateProfileBio(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.profileBio === this.user.profileBio) {
        resolve();
      } else {
        this.accountService.updateProfileBio(this.profileBio, msg => {
          if (!msg.successful) {
            this.modalService.openAlertModal('Failed to update profile bio.', msg.text);
            reject();
          } else {
            this.user.profileBio = this.profileBio;
            resolve();
          }
        });
      }
    });
  }

  private getListingsForCurrentUser(): void {
    this.listingService.getCurrentUsersListings().subscribe( res => {
      this.listings = res;
    });
  }

  private closeListing(listing: Listing): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        this.listingService.editListing(listing, msg => {
          if (!msg.successful) {
            this.modalService.openAlertModal('Failed to close listing.', msg.text);
            reject();
          } else {
            listing.isOpen = false;
            resolve();
          }
        });
    });
  }

  private openListing(): void {

  }

  private openEditListingModal(listing: Listing): void {
    this.modalService.openModal(ModalEditListingContentComponent, {listing: listing}, () => {
    });
  }

  private openFlagModal(listing): void {
    this.modalService.openModal<ModalBlockUserContentComponent>(ModalBlockUserContentComponent,
      {user: this.user});
  }

  private openMessageModal(user): void {
    this.modalService.openModal<ModalMessagingContentComponent>(ModalMessagingContentComponent, {user: this.user});
  }
}
