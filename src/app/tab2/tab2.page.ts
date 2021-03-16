import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  constructor() {}

  hasil=""
  tebakan:number
  angkarandom:number
  life = 3
  status=""

 
  ngOnInit(){
    this.angkarandom= this.float2int(Math.random() *(5-0)+0)
  }
   tebak(){
    if(this.tebakan!=this.angkarandom){
      this.hasil="SALAH"
      this.life -= 1
      if(this.life==0){
        this.hasil="PERMAINAN BERAKHIR"
        this.status="KALAH"
      }
    }else{
      this.hasil="BENAR"
      this.life=0
      if(this.life==0){
        this.hasil="PERMAINAN BERAKHIR"
        this.status="MENANG"

      }
      
    }

    
  }
  cobalagi(){
    this.life=3
    this.hasil=""
    this.tebakan=0
    this.angkarandom= this.float2int(Math.random() *(5-0)+0)
    this.status=""

  }
  float2int(value){
    return value | 0;
  }

}
