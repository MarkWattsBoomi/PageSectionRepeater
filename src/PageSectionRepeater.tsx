import React from "react";
import PageSectionRepeat from "./PageSectionRepeat";
import FlowSectionRepeat from "./PageSectionRepeat";
import PaginationBar from "./PaginationBar";
import RepeaterObject from "./RepeaterObject";
import RibbonBar from "./RibbonBar";

declare const manywho: any;

export default class PageSectionRepeater extends React.Component<any,any> {
    
    repeater: any;
    childElements: any;
    outcomes: any[] = [];

    repeaterItems: Map<string,RepeaterObject>;
    repeaterObjects: Map<string, PageSectionRepeat> = new Map();
    repeaterElements: Array<any>;

    repeaterPages: Array<any>;

    constructor(props: any) {
        super(props);
        this.getValue = this.getValue.bind(this);
        this.paginate = this.paginate.bind(this);
        this.buildFromModel = this.buildFromModel.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);

        this.triggerOutcome = this.triggerOutcome.bind(this);

        this.state={currentPage: 0};
    }

    setRepeatObject(key: string, element: any) {
        if(element) {
            this.repeaterObjects.set(key, element)
        }
        else {
            if(this.repeaterObjects.has(key)) {
                this.repeaterObjects.delete(key);
            }
        }
    }

    async componentDidMount() {

        //get and save top level repeating container
        this.repeater = manywho.model.getContainer(this.props.id, this.props.flowKey);
        this.childElements = manywho.model.getChildren(this.repeater.pageContainerId, this.props.flowKey);
        this.childElements.forEach((childElement: any) => {
            if(childElement.componentType==="outcomes") {
                let outcomes: any[] = manywho.model.getOutcomes(childElement.id, this.props.flowKey);
                outcomes?.forEach((outcome: any)=>{
                    this.outcomes.push(outcome);
                });
            }
        });
        
        

        //get model, it should be defined in an attribute called ListField
        if(!this.repeater.attributes?.modelField) {
            console.log("No modelField attribute specified on repeater")
        }
        else {
            let list: any = await this.getValue(this.props.flowKey, this.repeater.attributes?.modelField);
            this.buildFromModel(list.objectData);
        }
        
        this.forceUpdate();
    }

    async componentWillReceiveProps() {
        if(!this.repeater.attributes?.modelField) {
            console.log("No modelField attribute specified on repeater")
        }
        else {
            let list: any = await this.getValue(this.props.flowKey, this.repeater.attributes?.modelField);
            this.buildFromModel(list.objectData);
        }
        
        this.forceUpdate();
    }

    async getValue(flowKey: string, valueName: string): Promise<any> {
        let results: any;
        let stateId: string = manywho.utils.extractStateId(flowKey);
        let tenantId = manywho.utils.extractTenantId(flowKey);
        const request: RequestInit = {};
        const token: string = manywho.state.getAuthenticationToken(flowKey);

        request.method = "GET";  
        request.headers = {
            "Content-Type": "application/json",
            "ManyWhoTenant": tenantId
        };
        if(token) {
            request.headers.Authorization = token;
        }
        request.credentials= "same-origin";

        let url: string = window.location.origin || 'https://flow.manywho.com';
        url += "/api/run/1/state/" + stateId + "/values/name/" + valueName;
        
 
        let response = await fetch(url, request);
         if(response.status === 200) {
            results = await response.json();
        }
        else {
            //error
            const errorText = await response.text();
            console.log("Fetch Failed - " + errorText);
            
        }

        return results;
    }

    async setValue(flowKey: string, valueName: string, newValue: any): Promise<any> {
        let results: any;
        let stateId: string = manywho.utils.extractStateId(flowKey);
        let tenantId = manywho.utils.extractTenantId(flowKey);
        const request: RequestInit = {};
        const token: string = manywho.state.getAuthenticationToken(flowKey);

        request.method = "POST";  
        request.headers = {
            "Content-Type": "application/json",
            "ManyWhoTenant": tenantId
        };
        if(token) {
            request.headers.Authorization = token;
        }
        request.credentials= "same-origin";

        let val: any = await this.getValue(this.props.flowKey, valueName);
        if(val ) {
            val.isSelected = true;
            switch(val.contentType){
                case "ContentObject":
                case "ContentList":
                    val.objectData = [newValue];
                    break;

                default:
                    val.contentValue = newValue.contentValue;
            }
            
            request.body = JSON.stringify([val]);

            let url: string = window.location.origin || 'https://flow.manywho.com';
            url += "/api/run/1/state/" + stateId + "/values";
            
    
            let response = await fetch(url, request);
            if(response.status === 200) {
                results = await response.json();
            }
            else {
                //error
                const errorText = await response.text();
                console.log("Fetch Failed - " + errorText);
                
            }
        }

        return results;
    }

    buildFromModel(items: Array<any>) {
        this.repeaterItems = new Map();
        let order: number=1;
        items.forEach((item: any) => {
            this.repeaterItems.set(item.internalId, new RepeaterObject(item.internalId,order, item));
            order++;
        });
        this.paginate();
    }

    // this will convert the repeater items into page groups
    paginate() {
        this.repeaterPages = [];
        if(this.repeater.attributes?.pagination?.toLowerCase() === "true"){
            let page : any[] = [];
            let paginationSize: number = parseInt(this.repeater.attributes?.paginationSize || "5");
            this.repeaterItems.forEach((element: RepeaterObject, key: string) => {
                if(page.length < paginationSize) {
                    page.push(
                        element
                    );
                }
                else {
                    if(page.length > 0) {
                        this.repeaterPages.push(page);
                    }
                    page=[];
                    page.push(
                        element
                    );
                } 
            });
            // if a partial page is left then add it
            if(page.length > 0) {
                this.repeaterPages.push(page);
            }

        }
        else {
            this.repeaterPages.push([]);
            this.repeaterItems.forEach((element: RepeaterObject, key: string) => {
                this.repeaterPages[0].push(
                    element
                );
            });
        }
    }

    firstPage(){
        this.setState({currentPage: 0});
    }
    previousPage(){
        this.setState({currentPage: this.state.currentPage-1});
    }
    nextPage(){
        this.setState({currentPage: this.state.currentPage+1});
    }
    lastPage(){
        this.setState({currentPage: this.repeaterPages.length-1});
    }

    async triggerOutcome(outcome: any, selectedItemId: string) {
        let objectData: any = this.repeaterItems.get(selectedItemId)?.objectData;
        let stateField: string = this.repeater.attributes?.stateField;
        if(objectData && stateField){
            await this.setValue(this.props.flowKey, stateField, objectData);
        }
        if(outcome) {
            await manywho.component.onOutcome(outcome,objectData,this.props.flowKey);
        }
    }
    
    render() {

        if(!this.repeater || !this.repeaterItems) {
            return (
                <div/>
            );
        }

        let ribbon: any;
        if(this.outcomes.length > 0){
            ribbon = (
                <RibbonBar 
                    parent={this}
                    isTopLevel={true}
                />
            );
        }

        let pagBar: any;
        if(this.repeater.attributes?.pagination?.toLowerCase() === "true"){
            if(this.repeaterPages.length>1){
                pagBar = (
                    <PaginationBar 
                        parent={this}
                    />
                );
            }
        }

        

        //this is the class for the parent repeater container which will hold one clone per object data
        let parentClass: string = "mw-vertical_flow clearfix mw-container " + this.repeater.attributes?.classes;

        let repeaterElements: any[] = [];
        this.repeaterPages[this.state.currentPage].forEach((element: RepeaterObject) => {
            repeaterElements.push(
                <FlowSectionRepeat
                    key= {element.id}
                    internalId={element.id}
                    parent={this}
                    ref={(e: FlowSectionRepeat) => {this.setRepeatObject(element.id,e)}}
                />
            );
        });
        return(
            <div
                className="clearfix psr"
            >
                {ribbon}
                {repeaterElements}
                {pagBar}
            </div>
        );
    }
}

export const getChartContainer = () => PageSectionRepeater;
//: typeof G13PageSectionRepeater =>
//manywho.component.getByName("charts") || ChartContainer
manywho.component.registerContainer('charts', PageSectionRepeater);