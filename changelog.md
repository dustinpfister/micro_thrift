# micro_thrift change log

## RX () - donor object type, donations worker role
* (pending) - donor object type stated
* (pending) - donations worker role started

## RX () - Staff state update
* (pending) - can use Staff state to set hours and schedule
* (pending) - workers then spawn by way of game time system and set schedule 
* (pending) - can set primary role when working out schedule

## RX () - worker roles, cashier
* (pending) - a worker can have a role \( stock, cashier \) 
* (pending) - have a cashout tile 
* (pending) - customers can now only buy an item at a cashout tile that is active by a worker
* (pending) - a worker will change roles based on need

## RX () - Game Time System
* (pending) - start a game time system
* (pending) - have customers spawn by way of game time system

## RX () - Customer AI buying choice and spawn locations
* (pending) - customers will spawn at fixed location at top of map
* (pending) - customer AI : choice of buying an item or not based on personal pref set on spawn
* (pending) - customers will leave map after making buying an item, or after a timeout

## RX () - Staff state
* (pending) have a staff state that will be used to higher, fire, ect

## R2 () - Utils methods, Menu class, Tile Menu
* did away with revision string being displayed in floor state

* (pending) - adjust size of tiles and position of map so that it takes up much of the canvas in floor state
* (pending) - moved %full bar to top of canvas with money displayed

* (pending) - have a tile menu that will show up when a tile is clicked in floor state
* (pending) - start a utils object that will contain methods used in codebase
* (pending) - utils.bounding\_box method
* (pending) - utils.distance method

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


