export const transformSearchFieldValue = (data: any) => {
if(typeof data === 'object'){
    data = data._id
}

return data
};
