import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

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
  loading: HTMLIonLoadingElement;

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

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

    this.loading = await this.loadingCtrl.create({
      message:'Please wait...'
    });
  
    await this.loading.present();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan(){
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA){
      if (this.loading){
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
    }
    else{
      requestAnimationFrame(this.scan.bind(this));
    }
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
