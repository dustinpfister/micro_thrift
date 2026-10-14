# micro_thrift change log

## R3 () - Staff state
* (pending) have a staff state that will be used to higher, fire, ect

## R2 () - Utils methods, UI api, UI.Menu, map mutation
* did away with revision string being displayed in floor state
* adjusted size of tiles from 24px to 27px
* moved %full bar to top of canvas with money displayed
* start a utils object that will contain methods used in code base starting with a bounding box method
* start a UI api starting with absorbing button into it as UI.Button
* utils.distance method
* start a UI.Menu class that will be a collection of buttons and other UI features
* Have a UI.ButtonGrid class that is a Grid of UI.Buttons
* have an init method for a button grid that can be used to set up buttons
* can click a non map area to deselect tile mutation option
* a map.set_type method would be nice
* if a tile mutation option is selected change that tile when it is clicked
* have an ObjPool.reset method
* call sm.pool.reset in init method of floor state
* rename sm.pool to sm.people 
* have paths update on each move now for sm.people
* walk_target pos for people objects
* map: pos\_to\_px method
* have people objects become active only at spawn locations
* new stuck\_check method that works by finding a path to a spawn location
* both workers and customers no longer use old AI.target\_task method

## R1 ( done 09/07/2026 ) - Button Class, main menu, save manager, and options states
* start a button class
* Simg assets for Buttons in general
* start a main menu state
* start an options state with quit to menu, and continue options
* have a StateMachine.load_save method
* have a StateMachine.create_save method
* start a save manager state with a back to main menu button
* have a button that will start save manager state in main menu state
* have a sm.saves object with an auto key, and 3 numbered slots
* in the boot state check for local storage and if there load sm.saves data
* in the floor state keep saving to sm.saves.auto
* in save manager can play any slot
* in save manager can copy from one slot to another
* in main menu have a start new / continue button
* in save manager can delete any slot
* Simg asset for main menu title
* common conf.palette used for all SImg assets
* display info about a tile when it is clicked

## R0 ( done 09/01/2026 ) - Very basic core idea of the game started
* starting out with the code that I worked out at jsFiddle
* going with 16px assets, with a 16 by 16 map, and 640 by 480 screen res
* new SImg asset for customers and workers
* favicon
* started a config object to store various constants used in the codebase
* have both 'worker' and 'customer' types
* started an item and price option database
* started a main AI object for scripts that effect worker and customer actions
* have a map.get\_border\_tiles method with include\_types option
* have 'worker' type objects stock items
* have 'customer' type objects buy items
* have screen centered and scaled using css
* common AI.move method for all object types
* common AI.target\_task method to find, create path to, and run custom logic when it range of a target tile
* worker AI: very basic probability system for item generation
* display %full in floor state


