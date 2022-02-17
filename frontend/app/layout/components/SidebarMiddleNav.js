import React from "react";
import Translate from "../../utils/translate";

import { SidebarMenu } from "./../../components";

export const SidebarMiddleNav = () => (
    <SidebarMenu>
        <SidebarMenu.Item title={Translate.convert('Users')} icon={<i className="fa fa-fw fa-users"></i>} to="/apps/users/list" />
        <SidebarMenu.Item title={Translate.convert('SCP')} icon={<i className="fa fa-fw fa-check-square-o"></i>} to="/apps/scp" />
        <SidebarMenu.Item title={Translate.convert('Web')} icon={<i className="fa fa-fw fa-envira"></i>} to="/apps/web" />
        <SidebarMenu.Item title={Translate.convert('S3 List')} icon={<i className="fa fa-fw fa-amazon"></i>} to="/apps/s3/list" />
        <SidebarMenu.Item title={Translate.convert('PACs List')} icon={<i className="fa fa-fw fa-send-o"></i>} to="/apps/pac/list" />
        <SidebarMenu.Item title={Translate.convert('Work Log')} icon={<i className="fa fa-fw fa-envira"></i>} to="/apps/system/log" />
    </SidebarMenu>
);
