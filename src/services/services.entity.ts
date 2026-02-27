export class Services {

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public duration: number,
    public price: number,
    public image_url: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

}
