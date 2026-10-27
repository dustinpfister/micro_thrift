# micro_thrift change log

## R4 () - 

* (pending) - state of population now a part of the save state
* (pending) - make sure population, and schedule are deep cloned in from hard coded defaults

## R3 () - GameTime, Population, Staff state, Budget state
* added a game update method that can be called in any state beyond just floor state.
* start a GameTime system that will translate real time to game time
* create a new instance of GameTime as sm.time when a new game is loaded
* sm.time will need to be saved as part of a save state
* display the game time in floor state
* AI.move now moves objects from one pos to the next by a set number of frames
* utils.lerp method
* game speed should effect speed of people objects
* AI.move pause frames before getting a new next pos
* make it so that the player can not clear the spawn location
* start a staff state that will be used to manage workers
* start a Budget state to display what is going on with money
* money, time, ect part of common display
* common tab selection menu at the top of the screen to switch between floor, staff, and budget states
* can add an render_over option for Button class instances
* general render over method for Button Grid class
* can view current state of sm.people type workers
* start a new population class that is a Super class of ObjPool
* register all objects as a set type once in the constructor of Population
* have a Population.spawn method and use that as part of sm.spawn
* when a person object spawns that person must have an id in the pop database
* sm.spawn updated to spawn a certain person by pop id OR a type of person
* fixed bug with Population.reset when starting a new game
* just set up an array of schedule objects as part of load save process for now
* workers will show up, and leave based on GameTime events
* new sm.leave method to get people objects to head to the exit
* make use of sm.schedule clock in and out times
* fixed a bug with time binding
* fixed a bug where time would leap forward if tab goes inactive for a while
* customer spawns are also pushed into game time events along with workers
* Population.get\_options method
* customer spawns will vary in terms of who and when at the start of a new day
* fixed a bug with customers not buying items
* call pop.reset at the start of a new day
* added a WMap.get\_tiles\_by\_type method
* AI.set-shelf-target for smarter shelf targeting
* can view the state of the schedule in staff state
* UI.Slider class started to be used in a shift menu
* shift menu has a slider for setting start time at 15 min steps

<!-- edit schedule -->

* (pending) - shift menu has a slider for setting hours after start time
* (pending) - hours will adjust in shift menu when start time is adjusted
* (pending) - shift menu can be used to disable a day completely for a worker

<!-- workers cost money -->
* (pending) - workers will now cost money over time
* (pending) - total worker costs will be shown in budget state
* (pending) - changes to the map will now cost money and will show in budget
* (pending) - total sales will show in budget

<!-- misc -->
* (pending) - make the options state one of the tab menu states
* (pending) - make use of object pps again with object pools or remove code


## R2 ( done 09/14/2026 ) - Utils methods, UI api, map mutation
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


