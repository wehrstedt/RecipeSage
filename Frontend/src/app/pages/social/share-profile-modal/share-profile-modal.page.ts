import { Component, Input } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController } from '@ionic/angular';

import { UserService } from '@/services/user.service';
import { LoadingService } from '@/services/loading.service';
import { UtilService, RouteMap, AuthType } from '@/services/util.service';

@Component({
  selector: 'page-share-profile-modal',
  templateUrl: 'share-profile-modal.page.html',
  styleUrls: ['share-profile-modal.page.scss']
})
export class ShareProfileModalPage {

  hasCopyAPI: boolean = !!document.execCommand;
  hasWebShareAPI: boolean = !!(navigator as any).share;

  @Input() handle;
  @Input() userId;
  @Input() profile;

  profileUrl;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private loadingService: LoadingService,
    private userService: UserService,
    private modalCtrl: ModalController
  ) {
    setTimeout(() => {
      if (this.handle) this.loadFromHandle(this.handle);
      if (this.userId) this.loadFromUserId(this.userId);
      if (this.profile) {
        this.profileUrl = this.getProfileUrl();
      }
    });
  }

  async loadFromHandle(handle: string) {
    this.profile = await this.userService.getProfileByHandle(handle);
    this.profileUrl = this.getProfileUrl();
  }

  async loadFromUserId(userId: string) {
    this.profile = await this.userService.getProfileByUserId(userId);
    this.profileUrl = this.getProfileUrl();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getProfileUrl() {
    if (!this.profile) return "Error loading profile url";
    return `https://${window.location.host}/#/${RouteMap.ProfilePage.getPath(`@${this.profile.handle}`)}`;
  }

  webShare() {
    if (this.hasWebShareAPI) {
      (navigator as any).share({
        title: `${this.profile.name}'s RecipeSage profile`,
        text: `Click to view ${this.profile.name}'s public RecipeSage profile`,
        url: this.getProfileUrl(),
      }).then(() => this.cancel()).catch(() => {});
    }
  }

  copyCodeToClipboard() {
    const copyText = document.getElementById('codeBlockCopy') as any;

    copyText.select();

    document.execCommand('copy');
  }
}
