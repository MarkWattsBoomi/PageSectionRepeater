
export default class RepeaterObject {
    id: string;
    order: number;
    objectData: any;

    constructor(id: string, order: number, objectData: any) {
        this.id=id;
        this.order=order;
        this.objectData=objectData;
    }
}