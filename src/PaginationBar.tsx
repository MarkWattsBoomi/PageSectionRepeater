import React from "react";
import PageSectionRepeater from "./PageSectionRepeater";
import "./psr.css";

export default class PaginationBar extends React.Component<any,any> {

    render() {
        let parent: PageSectionRepeater = this.props.parent;
        let pg: number = parent.state.currentPage+1;
        let pgs: number = parent.repeaterPages.length;

        let fp;
        let fpClass = "glyphicon glyphicon-step-backward psr-pagination-button"
        let pp;
        let ppClass = "glyphicon glyphicon-triangle-left psr-pagination-button"
        let label = (<span className="psr-pagination-label">{"Page " + pg + " of " + pgs}</span>);
        let np;
        let npClass = "glyphicon glyphicon-triangle-right psr-pagination-button"
        let lp;
        let lpClass = "glyphicon glyphicon-step-forward psr-pagination-button"

        if(pg<=1){
            fpClass += "  psr-pagination-button-disabled"
            ppClass += "  psr-pagination-button-disabled"
        }
        if(pg>=pgs){
            npClass += "  psr-pagination-button-disabled"
            lpClass += "  psr-pagination-button-disabled"
        }

        fp=(<span className={fpClass} onClick={parent.firstPage}/>);
        pp=(<span className={ppClass} onClick={parent.previousPage}/>);
        np=(<span className={npClass} onClick={parent.nextPage}/>);
        lp=(<span className={lpClass} onClick={parent.lastPage}/>);

        return(
            <div
                className="psr-paginationbar"
            >
                <div
                    className="psr-paginationbar-buttons"
                >
                {fp}
                {pp}
                {label}
                {np}
                {lp}
                </div>
            </div>
        );
    }
}