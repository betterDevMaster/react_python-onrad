import React from 'react';
import Translate from '../../utils/translate';

export const CustomPaginationTotal = (props) => (
    <span className="small ml-2 pt-2">
        {Translate.convert('Showing')}&nbsp;&nbsp;{ props.from }&nbsp;&nbsp;
        {Translate.convert('to')}&nbsp;&nbsp;{ props.to }&nbsp;&nbsp;
        {Translate.convert('of')}&nbsp;&nbsp;{ props.size }&nbsp;&nbsp;
        {Translate.convert('Results')} 
    </span>
);