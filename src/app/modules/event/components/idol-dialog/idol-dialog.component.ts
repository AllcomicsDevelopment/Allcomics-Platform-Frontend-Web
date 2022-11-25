import { Component, OnInit } from '@angular/core';
import { IdolComponent } from '../../pages/idol/idol.component';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-idol-dialog',
  templateUrl: './idol-dialog.component.html',
  styleUrls: ['./idol-dialog.component.scss']
})
export class IdolDialogComponent implements OnInit {

  selected = '옵션 선택';
  constructor(private bottomSheetRef: MatBottomSheetRef<IdolComponent>) { }

  ngOnInit() {
  }

}
