const patternDict = [{
	pattern : '\\b(hi|hello|hey|bonjour)\\b',
	intent : 'hello'
},

{
	pattern : '\\b([0-9][0-9]/[0-9][0-9]/2[0-9][0-9][0-9]|[0-9]/[0-9]/2[0-9][0-9][0-9]|[0-9][0-9]/[0-9]/2[0-9][0-9][0-9]|[0-9]/[0-9][0-9]/2[0-9][0-9][0-9])\\b',
	intent : 'date'
},

{
	pattern : '\\b([0-9][0-9]-[0-9][0-9]-2[0-9][0-9][0-9]|[0-9]-[0-9]-2[0-9][0-9][0-9]|[0-9][0-9]-[0-9]-2[0-9][0-9][0-9]|[0-9]-[0-9][0-9]-2[0-9][0-9][0-9])\\b',
	intent : 'date'
},

{
	pattern : '\\b(paye)\\b',
	intent : 'payé'
},

{
	pattern : '\\b(naissance)\\b',
	intent : 'naissance'
},

{
	pattern : '\\b(maternite)\\b',
	intent : 'maternité'
},

{
	pattern : '\\b(maladie)\\b',
	intent : 'maladie'
},

{
	pattern : '\\b(mariage)\\b',
	intent : 'mariage'
},

{
	pattern : '\\b(conge)\\b',
	intent : 'congé'
},

{
	pattern : '\\b(bey|exit)\\b',
	intent : 'exit'
}
];


module.exports = patternDict;