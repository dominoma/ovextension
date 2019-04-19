import "./prompt.scss";

import * as React from "react";

type PromptManagerPrompts = {
    [key:string] : (data : any) => React.ReactNode;
}
type PromptProps = {
    name: string;
    data: any;
}
type PromptManagerProps = {

}
type PromptManagerState = {
    activePrompt: PromptProps | null;
}
export abstract class PromptManager extends React.Component<PromptManagerProps, PromptManagerState> {

    static async openPrompt(data : PromptProps | string) : Promise<any> {

    }
    private static onSubmitted(state : any) {

    }
    private static promptCreated = false;

    constructor(props : PromptManagerProps) {
        super(props);
        if(PromptManager.promptCreated) {
            throw new Error("Prompt Manager already exists!");
        }
        this.state = { activePrompt: null };
        PromptManager.promptCreated = true;
        PromptManager.openPrompt = async (data : PromptProps | string) => {
            let promptData = typeof data == "string" ? { name: data, data: null } : data;
            return new Promise<any>((resolve, reject)=>{
                PromptManager.onSubmitted = (state : any) => {
                    resolve(state);
                }
                this.setState({ activePrompt: promptData });
            });
        }
    }

    protected submit(state : any) {
        this.setState({ activePrompt: null });
        PromptManager.onSubmitted(state);
    }

    protected abstract getPrompts() : PromptManagerPrompts;

    render() {
        if(this.state.activePrompt) {
            return (
                <div className="ov-prompt-wrapper">
                    <div className="ov-prompt-content">
                        {this.getPrompts()[this.state.activePrompt.name](this.state.activePrompt.data)}
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

}
