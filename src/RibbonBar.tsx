import React from "react";
import PageSectionRepeater from "./PageSectionRepeater";

export default class RibbonBar extends React.Component<any,any> {
    

    render() {
        let parent: PageSectionRepeater = this.props.parent;
        let buttons: any[] = [];
        parent.outcomes.forEach((outcome: any) => {
            if((this.props.isTopLevel===true && outcome.isBulkAction===true) || (this.props.isTopLevel===false && outcome.isBulkAction===false))
            buttons.push(
                <span
                    className="psr-ribbonbar-button"
                    onClick={(e: any) => {parent.triggerOutcome(outcome, this.props.internalId)}}
                >
                    <span 
                        className={"psr-ribbonbar-button-icon glyphicon glyphicon-" + (outcome.attributes?.icon? outcome.attributes?.icon : "") + " " + (outcome.attributes?.classes? outcome.attributes?.classes : "")}
                    />
                    <span
                        className="psr-ribbonbar-button-label"
                    >
                        {outcome.label || outcome.developerName}
                    </span>
                </span>
            );
        });

        let btnBar: any;
        if(buttons.length>0){
            btnBar = (
                <div
                    className="psr-ribbonbar-buttons"
                >
                    {buttons}
                </div>
            );
        }
        
        return (
            <div
                className="psr-ribbonbar"
            >
                {btnBar}
            </div>
        );
    }
}