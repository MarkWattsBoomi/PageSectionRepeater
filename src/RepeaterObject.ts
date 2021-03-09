import { FlowObjectData } from "flow-component-model";

export default class RepeaterObject {
    id: string;
    order: number;
    objectData: FlowObjectData;

    constructor(id: string, order: number, objectData: FlowObjectData) {
        this.id=id;
        this.order=order;
        this.objectData=objectData;
    }
}