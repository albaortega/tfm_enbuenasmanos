export class Price{
    public id: string;
	public service: string;
    public price_kids: number;
    public price_home: number;
    public price_hospital: number;
    constructor(){
        this.id = '';
    	this.service = '';
        this.price_kids = 0.0;
        this.price_home = 0.0;
        this.price_hospital = 0.0;
    }
}
