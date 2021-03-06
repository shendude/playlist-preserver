#playlist-preserver
tracks changes made to your soundcloud playlists, in addition to creating a backup in event of account termination (or worse: copyright strikes)

#Intro Spiel
Have you ever been annoyed at soundcloud copyright takedowns? Ever create that perfect 50-track driving playlist only to find out weeks later that it had become 47 tracks long? Ever stared at your playlist trying to remenber what songs were removed, only to give up in frustration?

Now no longer will you have to accept 47 track long 50-track playlists! With playlist-preserver you will be able to clearly see what songs were added or removed, in addition to keeping track of copyright takedowns!  Give the middle finger to the man!

#What it Does
This helper app allows you to save a playlist on your computer as raw text. This text doc. becomes the file from which playlist edits are tracked. Resubmitting it highlights all changes made to the playlist since the file was created. 

-When the user adds or removes songs via his soundcloud account, changes are shown in the app highlighted blue.

-When soundcloud themselves remove songs from your playlist (eg. DCMA takedowns), changes are shown in the app highlighted orange. 


*note: This app does not require any login's and does not save your data. It will never change anything on soundcloud.*

#How to use


1)*Initializing:* Enter your soundcloud username into the textbox and click **SEARCH**. Click yourself!

2)Click on a playlist to bring up the playlist in text form.

3)*Updating and Viewing:* As your playlist changes over time, **UPDATE** and **SUBMIT PLAYLIST** via the update option from step 2.
Select your playlist text file.

4)View your playlist,  color coded for your convenience.



  * BOLD = recent changes

  * CROSSED = removed from playlist

  * BLUE = changes made by Soundcloud user

  * ORANGE = changes (removals expecially) made by Soundcloud




5)Finally, save your playlist again. Click the **Click Here to Save** button.

#FAQ
 -**I can't find myself!**

Try searching the user's username. The username will show up in their soundcloud URL. Eg. the account for Shensen Wang has a profile found at https://soundcloud.com/shensen-wang and has shensen-wang set as their username.

 -**I don't see any playlists!**

The app must pull info from the soundcloud server. If the user has made a playlist yet it doesn't show up on this app, either the playlist was set to private, or the soundcloud servers are busy. 

 -**Nothing is highlighted (or nothing has changed) when I submitted my playlist into the app!**

This app tracks changes made to your playlist only after the initial playlist text file is created. Unfortunately there's no way to gleam more information from soundcloud's API. As a result, only songs that were added or deleted after creating a text file will be highlighted. If the playlist on soundcloud has not been edited since the last time you've updated your text file, there would be no "changes" to display. Try adding some songs to your playlist via the soundcloud website. 

 -**What is the difference between regular, bold, and crossed-out-text? What do the colors mean?**

Regular text highlighting denotes older changes made to the base playlist file before the latest file submission/update. Bold text denotes recent changes made since the last update. Crossed-out-text denotes songs that have been removed from the playlist. Black text denotes songs that made up the base playlist file (eg. the playlist you had when you first started tracking it). Blue highlighting indicates changes made by the user (the soundcloud account holder who originally created the playlist). Orange highlighting are songs removed by soundcloud (due to either copyright takedowns or the artist taking down the song themselves).

-**How do I make a new playlist?**

You need to have registered a soundcloud accout. Visit the soundcloud how-to guide 
(http://uploadandmanage.help.soundcloud.com/customer/portal/articles/2166978-creating-and-adding-tracks-to-a-playlist) for more info.

-**How do I edit a playlist?**

Only the soundcloud user who has made the playlist can change it. Visit the soundcloud how-to guide (http://uploadandmanage.help.soundcloud.com/customer/portal/articles/2122125-managing-and-customizing-your-playlist) for more info.

-**How come the changes I've made aren't showing up?**

Make sure the text file you've submitted belongs to the playlist you've made changes to. Every text file tracks its own specific playlist.
Additional note: Changes made using the soundcloud mobile app are sync'd infrequently with soundcloud's databases. Changes made on the soundcloud website are instantaneously updated in the database, and subsequently shown in this app. 

#Example
to see an example of this app in action, feel free to look at my own playlist:

   link: https://soundcloud.com/shendude/sets/test

1)enter shendude for the username

2)update playlist using the included playlist in the 'test.txt' file from the project folder

*Note how Song1 (which was uploaded by yours truely and unceremonously takendown a mere 10min later) is shown in orange: signifying a takedown event. It is highlited in orange and bolded, showing its been takendown by soundcloud (acting on my behalf) and a recent event (test.txt was not updated to include this event)*

*Note how Song 5 - sheppard- Geronimo (Matoma Remix) is crossed out, bold, and blue. This signifies that it was removed, done recently, and done by the user, respectively. If you try to find the song on soundcloud.com, it is still there! Unlike my Song1, which is nowhere to be seen.*

3)if you save the updated playlist and resubmit it, no songs will be in bold, signifying that there were no changes made to the playlist since the last save.
