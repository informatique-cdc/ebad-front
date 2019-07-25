export class Option {
  value: any;
  label: string;
  selected: boolean;

  constructor(value: any, label: string, selected: boolean) {
    this.value = value;
    this.label = label;
    this.selected = selected;
  }
}
