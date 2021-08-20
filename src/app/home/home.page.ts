import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scanActive = false;
  scanResult = null;
  @ViewChild('video', { static: false }) video: ElementRef;

  videoElement: any;

  constructor(private toastCtrl: ToastController) {}

ngAfterViewInit(): void {
  this.videoElement = this.video.nativeElement;
  
}
  async startScan(){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'enviroment'}
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();
  }

  // Helpers functions

  stopScan(){
    this.scanActive = false;
  }

  reset(){
    this.scanResult = null;
  }

  async showQrToast(){
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_syatem', 'location=yes');
          }
        }
      ]

    });
    toast.present();
  }

  
}
