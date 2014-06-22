#!/usr/bin/lasso9

/*
	Builtins Generator for Lasso 9

	This is the shell script that was used to extract Lasso 9's built-in keywords
	and generate most of the _lassobuiltins.py file. When run, it creates a file
	named "lassobuiltins-9.py" containing the types, traits, methods, and members
	of the currently-installed version of Lasso 9.

	A list of tags in Lasso 8 can be generated with this code:

	<?LassoScript
		local('l8tags' = list,
					'l8libs' = array('Cache','ChartFX','Client','Database','File','HTTP',
						'iCal','Lasso','Link','List','PDF','Response','Stock','String',
						'Thread','Valid','WAP','XML'));
		iterate(#l8libs, local('library'));
			local('result' = namespace_load(#library));
		/iterate;
		iterate(tags_list, local('i'));
			#l8tags->insert(string_removeleading(#i, -pattern='_global_'));
		/iterate;
		#l8tags->sort;
		iterate(#l8tags, local('i'));
			string_lowercase(#i)+"<br>";
		/iterate;

*/

output("This output statement is required for a complete list of methods.")
local(f) = file("lassobuiltins-9.py")
#f->doWithClose => {

#f->openWrite
#f->writeString('# -*- coding: utf-8 -*-
"""
    pygments.lexers._lassobuiltins
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Built-in Lasso types, traits, methods, and members.

    :copyright: Copyright 2006-'+date->year+' by the Pygments team, see AUTHORS.
    :license: BSD, see LICENSE for details.
"""

')

lcapi_loadModules

// Load all of the libraries from builtins and lassoserver
// This forces all possible available types and methods to be registered
local(srcs =
	tie(
		dir(sys_masterHomePath + 'LassoLibraries/builtins/')->eachFilePath,
		dir(sys_masterHomePath + 'LassoLibraries/lassoserver/')->eachFilePath
	)
)

with topLevelDir in #srcs
where not #topLevelDir->lastComponent->beginsWith('.')
do protect => {
	handle_error => {
		stdoutnl('Unable to load: ' + #topLevelDir + ' ' + error_msg)
	}
	library_thread_loader->loadLibrary(#topLevelDir)
	stdoutnl('Loaded: ' + #topLevelDir)
}

local(
	typesList = list(),
	traitsList = list(),
	unboundMethodsList = list(),
	memberMethodsList = list()
)

// types
with type in sys_listTypes
where #typesList !>> #type
do {
	#typesList->insert(#type)
	with method in #type->getType->listMethods
	let name = #method->methodName
	where not #name->asString->endsWith('=')		// skip setter methods
	where #name->asString->isAlpha(1)		// skip unpublished methods
	where #memberMethodsList !>> #name
	do #memberMethodsList->insert(#name)
}

// traits
with trait in sys_listTraits
where not #trait->asString->beginsWith('$')		// skip combined traits
where #traitsList !>> #trait
do {
	#traitsList->insert(#trait)
	with method in tie(#trait->getType->provides, #trait->getType->requires)
	let name = #method->methodName
	where not #name->asString->endsWith('=')		// skip setter methods
	where #name->asString->isAlpha(1)		// skip unpublished methods
	where #memberMethodsList !>> #name
	do #memberMethodsList->insert(#name)
}

// unbound methods
with method in sys_listUnboundMethods
let name = #method->methodName
where not #name->asString->endsWith('=')		// skip setter methods
where #name->asString->isAlpha(1)		// skip unpublished methods
where #typesList !>> #name
where #traitsList !>> #name
where #unboundMethodsList !>> #name
do #unboundMethodsList->insert(#name)

#f->writeString("BUILTINS = {
    'Types': [
")
with t in #typesList
do !#t->asString->endsWith('$') ? #f->writeString("        '"+string_lowercase(#t->asString)+"',\n")

#f->writeString("    ],
    'Traits': [
")
with t in #traitsList
do #f->writeString("        '"+string_lowercase(#t->asString)+"',\n")

#f->writeString("    ],
    'Unbound Methods': [
")
with t in #unboundMethodsList
do #f->writeString("        '"+string_lowercase(#t->asString)+"',\n")

#f->writeString("    ]
}
MEMBERS = {
    'Member Methods': [
")
with t in #memberMethodsList
do #f->writeString("        '"+string_lowercase(#t->asString)+"',\n")

#f->writeString("    ]
}
")

}
