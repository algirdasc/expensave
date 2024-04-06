import {Component} from '@angular/core';

@Component({
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  public question: string = 'Are you sure?';
  public yesText: string = 'Yes';
  public noText: string = 'No';
}
