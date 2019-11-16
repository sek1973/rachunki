export class ConfirmDialogModel {
  constructor(
    public dialogTitle: string,
    public message: string,
    public cancelButtonLabel = 'Anuluj',
    public applyButtonLabel = 'OK'
  ) { }
}
